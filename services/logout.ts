import apiClient from "@/utils/api"

export const logout = async () => {
  try {
    await apiClient.post("/admin/logout")
    return { success: true }
  } catch (error) {
    console.error("Logout failed:", error)
    return { success: false, error }
  }
}