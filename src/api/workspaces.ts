import axios from "../utils/axios";

export const fetchWorkspaces = async () => {
  try {
    const res = await axios.get("/workspaces?owner=me");
    return res.data;
  } catch (error) {
    console.error("Error fetching workspaces", error);
    throw new Error("Failed to fetch workspaces");
  }
};

export const createWorkspace = async (data: {
  name: string;
  templateId: string;
}) => {
  try {
    const coderUser = await axios.get("/users/me");
    if (!coderUser) {
      throw new Error("No coder user found");
    }
    const orgId = coderUser.data.organization_ids[0];
    const memberId = coderUser.data.id;

    const res = await axios.post(
      `/organizations/${orgId}/members/${memberId}/workspaces`,
      {
        name: data.name,
        automatic_updates: "always",
        template_id: data.templateId,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating workspace", error);
    throw new Error("Failed to create workspace");
  }
};
