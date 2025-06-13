import { FeaturedExpert } from "../../../../api/services/admin.service";

/**
 * Formats expert expertise areas into a readable string
 */
export const formatExpertiseAreas = (
  expertiseAreas: FeaturedExpert["expertiseAreas"],
): string => {
  if (!expertiseAreas || expertiseAreas.length === 0)
    return "No expertise areas";

  const areas = expertiseAreas.map(
    (area) => `${area.categoryName} - ${area.subCategoryName}`,
  );

  if (areas.length <= 2) {
    return areas.join(", ");
  }

  return `${areas.slice(0, 2).join(", ")} and ${areas.length - 2} more`;
};

/**
 * Formats advisory topics into a readable string
 */
export const formatAdvisoryTopics = (topics: string[]): string => {
  if (!topics || topics.length === 0) return "No advisory topics";

  if (topics.length <= 3) {
    return topics.join(", ");
  }

  return `${topics.slice(0, 3).join(", ")} and ${topics.length - 3} more`;
};

/**
 * Gets the display name for an expert
 */
export const getExpertDisplayName = (expert: FeaturedExpert): string => {
  return expert.username || expert.email.split("@")[0] || "Unknown Expert";
};

/**
 * Checks if an expert has complete profile information
 */
export const isExpertProfileComplete = (expert: FeaturedExpert): boolean => {
  return !!(
    expert.username &&
    expert.bio &&
    expert.image &&
    expert.expertiseAreas?.length > 0 &&
    expert.advisoryTopics?.length > 0 &&
    expert.rate
  );
};

/**
 * Gets the completion percentage for an expert profile
 */
export const getExpertProfileCompletion = (expert: FeaturedExpert): number => {
  const fields = [
    !!expert.username,
    !!expert.bio,
    !!expert.image,
    !!expert.phone,
    !!expert.linkedinUrl,
    !!expert.websiteUrl,
    !!(expert.expertiseAreas?.length > 0),
    !!(expert.advisoryTopics?.length > 0),
    !!expert.rate,
  ];

  const completedFields = fields.filter(Boolean).length;
  return Math.round((completedFields / fields.length) * 100);
};
