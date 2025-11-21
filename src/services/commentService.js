import api from "./api";

export const getComments = async (movieId) => {
  const res = await api.get(`/comments/${movieId}`);
  return res.data;
};

export const addComment = async (movieId, comment) => {
  const res = await api.post(`/comments/${movieId}`, comment);
  return res.data;
};
