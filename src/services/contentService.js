
import api from "./api";

// ===============================
// SERIES APIs
// ===============================

// Get all series
export const getAllSeries = () => {
  return api.get("/content/series");
};

// Get one series by ID
export const getSeriesById = (id) => {
  return api.get(`/content/series/${id}`);
};

// Create a series
export const createSeries = (seriesData) => {
  return api.post("/content/series", seriesData);
};

// Update a series
export const updateSeries = (id, seriesData) => {
  return api.put(`/content/series/${id}`, seriesData);
};

// Delete a series
export const deleteSeries = (id) => {
  return api.delete(`/content/series/${id}`);
};

// ===============================
// CHAPTER APIs
// ===============================

// Get all chapters belonging to a series
export const getChaptersBySeries = (seriesId) => {
  return api.get(`/content/series/${seriesId}/chapters`);
};

// Get one chapter by ID
export const getChapterById = (chapterId) => {
  return api.get(`/content/chapters/${chapterId}`);
};

// Create a chapter under a series
export const createChapter = (seriesId, chapterData) => {
  return api.post(
    `/content/series/${seriesId}/chapters`,
    chapterData
  );
};

// Update a chapter
export const updateChapter = (chapterId, chapterData) => {
  return api.put(`/content/chapters/${chapterId}`, chapterData);
};

// Delete a chapter
export const deleteChapter = (chapterId) => {
  return api.delete(`/content/chapters/${chapterId}`);
};
