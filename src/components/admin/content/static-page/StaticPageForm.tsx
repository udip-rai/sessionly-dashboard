import { 
  AboutPageContent, 
  HomePageContent, 
  TeamPageContent 
} from "../../../../api/services/admin.service";
import { StaticAboutPage, StaticHomePage, StaticTeamPage } from "./";
import { StaticPageFormData } from "./useStaticPageData";

interface StaticPageFormProps {
  selectedPageType: "home" | "about" | "team";
  formData: StaticPageFormData;
  editingPage: any;
  pageTypeExists: (type: "home" | "about" | "team") => boolean;
  onPageTypeChange: (type: "home" | "about" | "team") => void;
  onTitleChange: (title: string) => void;
  onContentChange: (content: HomePageContent | AboutPageContent | TeamPageContent) => void;
  onLoadDefaultAbout: () => void;
  onLoadDefaultTeam: () => void;
}

export const StaticPageForm = ({
  selectedPageType,
  formData,
  editingPage,
  pageTypeExists,
  onPageTypeChange,
  onTitleChange,
  onContentChange,
  onLoadDefaultAbout,
  onLoadDefaultTeam,
}: StaticPageFormProps) => {
  return (
    <div className="space-y-6">
      {/* Page Type Selection (only for new pages) */}
      {!editingPage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Type *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="about"
                checked={selectedPageType === "about"}
                onChange={(e) =>
                  onPageTypeChange(e.target.value as "about")
                }
                className="mr-2"
                disabled={pageTypeExists("about")}
              />
              About Page
              {pageTypeExists("about") && (
                <span className="ml-2 text-xs text-red-500">
                  (Already created)
                </span>
              )}
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="home"
                checked={selectedPageType === "home"}
                onChange={(e) =>
                  onPageTypeChange(e.target.value as "home")
                }
                className="mr-2"
                disabled={pageTypeExists("home")}
              />
              Home Page
              {pageTypeExists("home") && (
                <span className="ml-2 text-xs text-red-500">
                  (Already created)
                </span>
              )}
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="team"
                checked={selectedPageType === "team"}
                onChange={(e) =>
                  onPageTypeChange(e.target.value as "team")
                }
                className="mr-2"
                disabled={pageTypeExists("team")}
              />
              Team Page
              {pageTypeExists("team") && (
                <span className="ml-2 text-xs text-red-500">
                  (Already created)
                </span>
              )}
            </label>
          </div>

          {/* Load Default Content Button for About Page */}
          {selectedPageType === "about" && !pageTypeExists("about") && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onLoadDefaultAbout}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Load default About page content
              </button>
            </div>
          )}

          {/* Load Default Content Button for Team Page */}
          {selectedPageType === "team" && !pageTypeExists("team") && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onLoadDefaultTeam}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Load default Team page content
              </button>
            </div>
          )}
        </div>
      )}

      {/* Page Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Page Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
          placeholder="Enter page title"
          autoFocus
        />
      </div>

      {/* Page Content Form */}
      {selectedPageType === "about" && (
        <StaticAboutPage
          key={editingPage ? `about-${editingPage._id}` : "about-create"}
          content={formData.content as AboutPageContent}
          onChange={onContentChange}
        />
      )}
      {selectedPageType === "home" && (
        <StaticHomePage
          key={editingPage ? `home-${editingPage._id}` : "home-create"}
          content={formData.content as HomePageContent}
          onChange={onContentChange}
        />
      )}
      {selectedPageType === "team" && (
        <StaticTeamPage
          key={editingPage ? `team-${editingPage._id}` : "team-create"}
          content={formData.content as TeamPageContent}
          onChange={onContentChange}
        />
      )}
    </div>
  );
};
