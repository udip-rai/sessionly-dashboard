import { StaticPage } from "../../../../api/services/admin.service";
import { AddButton } from "../../../ui";
import { StaticPageCard } from "./StaticPageCard";

interface StaticPageListProps {
  pages: StaticPage[];
  loading: boolean;
  onEdit: (page: StaticPage) => void;
  onDelete: (pageId: string, title: string) => void;
  onCreateNew: () => void;
}

export const StaticPageList = ({ 
  pages, 
  loading, 
  onEdit, 
  onDelete, 
  onCreateNew 
}: StaticPageListProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
        <p className="mt-2 text-gray-500">Loading Static Pages...</p>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No static pages found</p>
        <AddButton onClick={onCreateNew} className="mx-auto">
          Create Your First Page
        </AddButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pages.map((page) => (
        <StaticPageCard
          key={page._id}
          page={page}
          onEdit={onEdit}
          onDelete={onDelete}
          loading={loading}
        />
      ))}
    </div>
  );
};
