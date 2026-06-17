import axios from "axios";

const defaultApiBaseUrl =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:5000`
    : "http://localhost:5000";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || defaultApiBaseUrl,
});

const toApiError = (error, fallbackMessage) => {
  const message = error?.response?.data?.message || fallbackMessage;
  return new Error(message);
};

const buildPostFormData = (data, options = {}) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("location", data.location);

  if (data.imageFile) {
    formData.append("photo", data.imageFile);
  } else if (data.imageUrl) {
    formData.append("image", data.imageUrl);
  }

  if (options.includeDate) {
    formData.append("date", data.date);
  }

  if (options.includeUser) {
    formData.append("user", localStorage.getItem("userId") || "");
  }

  return formData;
};

export const getAllPosts = async () => {
  try {
    const res = await api.get("/posts");
    if (res.status !== 200) {
      throw new Error("Some error occurred");
    }

    const data = res.data;
    return data;
  } catch (error) {
    throw toApiError(error, "Unable to load diaries.");
  }
};

export const sendAuthRequest = async (signup, data) => {
  try {
    const res = await api.post(`/user/${signup ? "signup" : "login"}/`, {
      name: data.name ? data.name : "",
      email: data.email,
      password: data.password,
    });

    if (res.status !== 200 && res.status !== 201) {
      throw new Error("Unable to authenticate");
    }
    const resData = await res.data;
    return resData;
  } catch (error) {
    throw toApiError(error, "Unable to authenticate.");
  }
};

export const addPost = async (data) => {
  try {
    const res = await api.post(
      "/posts/",
      buildPostFormData(data, { includeDate: true, includeUser: true })
    );

    if (res.status !== 201) {
      throw new Error("Error occurred");
    }

    const resData = await res.data;
    return resData;
  } catch (error) {
    throw toApiError(error, "Unable to add diary.");
  }
};

export const getPostDetails = async (id) => {
  try {
    const res = await api.get(`/posts/${id}`);
    if (res.status !== 200) {
      throw new Error("Unable to fetch diary");
    }

    const resData = await res.data;
    return resData;
  } catch (error) {
    throw toApiError(error, "Unable to fetch diary.");
  }
};

export const postUpdate = async (data, id) => {
  try {
    const res = await api.put(`/posts/${id}`, buildPostFormData(data));

    if (res.status !== 200) {
      throw new Error("Unable to update");
    }

    const resData = await res.data;
    return resData;
  } catch (error) {
    throw toApiError(error, "Unable to update diary.");
  }
};

export const postDelete = async (id) => {
  try {
    const res = await api.delete(`/posts/${id}`);

    if (res.status !== 200) {
      throw new Error("Unable to delete");
    }

    const resData = await res.data;
    return resData;
  } catch (error) {
    throw toApiError(error, "Unable to delete diary.");
  }
};

export const getUserDetails = async () => {
  try {
    const id = localStorage.getItem("userId");
    const res = await api.get(`/user/${id}`);

    if (res.status !== 200) {
      throw new Error("No user found");
    }

    const resData = await res.data;
    return resData;
  } catch (error) {
    throw toApiError(error, "Unable to load profile.");
  }
};

export const syncClerkUser = async (data, token) => {
  try {
    const res = await api.post("/user/sync", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status !== 200) {
      throw new Error("Unable to sync Clerk user");
    }

    return res.data;
  } catch (error) {
    throw toApiError(error, "Unable to sync Clerk user.");
  }
};


export const getWebsiteViews = async () => {
  try {
    const res = await api.get("/views");

    if (res.status !== 200) {
      throw new Error("Unable to load website views");
    }

    return res.data;
  } catch (error) {
    throw toApiError(error, "Unable to load website views.");
  }
};

export const incrementWebsiteViews = async () => {
  try {
    const res = await api.post("/views");

    if (res.status !== 200) {
      throw new Error("Unable to update website views");
    }

    return res.data;
  } catch (error) {
    throw toApiError(error, "Unable to update website views.");
  }
};
