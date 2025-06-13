import {
  StaticPage,
  HomePageContent,
  AboutPageContent,
  TeamPageContent,
} from "../../../../api/services/admin.service";
import {
  EMPTY_ABOUT_PAGE,
  EMPTY_HOME_PAGE,
  EMPTY_TEAM_PAGE,
} from "../constants/staticPageDefaults";

export const normalizePageData = (page: StaticPage) => {
  // The content field comes as a stringified JSON from the API
  let parsedContent: HomePageContent | AboutPageContent | TeamPageContent;
  try {
    // Parse the stringified content
    parsedContent = JSON.parse(page.content);
  } catch (error) {
    console.error("Failed to parse page content:", error);
    // Fallback to empty content based on page type
    parsedContent =
      page.type === "about"
        ? EMPTY_ABOUT_PAGE
        : page.type === "team"
        ? EMPTY_TEAM_PAGE
        : EMPTY_HOME_PAGE;
  }

  if (page.type === "about") {
    const aboutContent = parsedContent as AboutPageContent;
    const emptyAbout = EMPTY_ABOUT_PAGE;
    const currentCards = aboutContent?.features?.cards || [];
    const normalizedCards = [...currentCards];
    while (normalizedCards.length < 4) {
      normalizedCards.push({ title: "", description: "" });
    }
    normalizedCards.splice(4);

    return {
      hero: {
        title: aboutContent?.hero?.title || emptyAbout.hero.title,
        descriptors:
          aboutContent?.hero?.descriptors || emptyAbout.hero.descriptors,
        description: {
          intro:
            aboutContent?.hero?.description?.intro ||
            emptyAbout.hero.description.intro,
          stats:
            aboutContent?.hero?.description?.stats ||
            emptyAbout.hero.description.stats,
          aiMatch:
            aboutContent?.hero?.description?.aiMatch ||
            emptyAbout.hero.description.aiMatch,
        },
      },
      mission: {
        title: aboutContent?.mission?.title || emptyAbout.mission.title,
        description:
          aboutContent?.mission?.description || emptyAbout.mission.description,
      },
      features: {
        title: {
          why:
            aboutContent?.features?.title?.why || emptyAbout.features.title.why,
          choose:
            aboutContent?.features?.title?.choose ||
            emptyAbout.features.title.choose,
        },
        cards: normalizedCards,
      },
      cta: {
        title: aboutContent?.cta?.title || emptyAbout.cta.title,
        description:
          aboutContent?.cta?.description || emptyAbout.cta.description,
        disclaimer: aboutContent?.cta?.disclaimer || emptyAbout.cta.disclaimer,
      },
    };
  } else if (page.type === "team") {
    const teamContent = parsedContent as TeamPageContent;
    const emptyTeam = EMPTY_TEAM_PAGE;

    return {
      page: {
        title: teamContent?.page?.title || emptyTeam.page.title,
        highlighted:
          teamContent?.page?.highlighted || emptyTeam.page.highlighted,
        subtitle: teamContent?.page?.subtitle || emptyTeam.page.subtitle,
        description:
          teamContent?.page?.description || emptyTeam.page.description,
      },
      stats:
        teamContent?.stats?.length >= 4
          ? teamContent.stats.slice(0, 4)
          : [
              ...(teamContent?.stats || []),
              ...emptyTeam.stats.slice(teamContent?.stats?.length || 0),
            ],
      values:
        teamContent?.values?.length >= 4
          ? teamContent.values.slice(0, 4)
          : [
              ...(teamContent?.values || []),
              ...emptyTeam.values.slice(teamContent?.values?.length || 0),
            ],
      sections: {
        team: {
          title:
            teamContent?.sections?.team?.title || emptyTeam.sections.team.title,
          highlighted:
            teamContent?.sections?.team?.highlighted ||
            emptyTeam.sections.team.highlighted,
          subtitle:
            teamContent?.sections?.team?.subtitle ||
            emptyTeam.sections.team.subtitle,
        },
        values: {
          title:
            teamContent?.sections?.values?.title ||
            emptyTeam.sections.values.title,
          highlighted:
            teamContent?.sections?.values?.highlighted ||
            emptyTeam.sections.values.highlighted,
          subtitle:
            teamContent?.sections?.values?.subtitle ||
            emptyTeam.sections.values.subtitle,
        },
        join: {
          title:
            teamContent?.sections?.join?.title || emptyTeam.sections.join.title,
          highlighted:
            teamContent?.sections?.join?.highlighted ||
            emptyTeam.sections.join.highlighted,
          description:
            teamContent?.sections?.join?.description ||
            emptyTeam.sections.join.description,
        },
      },
    };
  } else {
    const homeContent = parsedContent as HomePageContent;
    const emptyHome = EMPTY_HOME_PAGE;

    return {
      title: homeContent?.title || emptyHome.title,
      description: homeContent?.description || emptyHome.description,
      everything_reasons: {
        title:
          homeContent?.everything_reasons?.title ||
          emptyHome.everything_reasons.title,
        description:
          homeContent?.everything_reasons?.description ||
          emptyHome.everything_reasons.description,
        children:
          homeContent?.everything_reasons?.children ||
          emptyHome.everything_reasons.children,
      },
      transform_reasons: {
        title:
          homeContent?.transform_reasons?.title ||
          emptyHome.transform_reasons.title,
        children:
          homeContent?.transform_reasons?.children ||
          emptyHome.transform_reasons.children,
      },
      advantages_reasons: {
        title:
          homeContent?.advantages_reasons?.title ||
          emptyHome.advantages_reasons.title,
        description:
          homeContent?.advantages_reasons?.description ||
          emptyHome.advantages_reasons.description,
        children:
          homeContent?.advantages_reasons?.children ||
          emptyHome.advantages_reasons.children,
      },
      powered_by_ai_reasons: {
        title:
          homeContent?.powered_by_ai_reasons?.title ||
          emptyHome.powered_by_ai_reasons.title,
        description:
          homeContent?.powered_by_ai_reasons?.description ||
          emptyHome.powered_by_ai_reasons.description,
        children:
          homeContent?.powered_by_ai_reasons?.children ||
          emptyHome.powered_by_ai_reasons.children,
      },
      testimonials: {
        title: homeContent?.testimonials?.title || emptyHome.testimonials.title,
        description:
          homeContent?.testimonials?.description ||
          emptyHome.testimonials.description,
      },
    };
  }
};
