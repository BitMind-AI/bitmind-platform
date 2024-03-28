import axios from '../utils/axios'

export const fetchTemplates = async () => {
  try {
    const coderUser = await axios.get('/users/me')
    if (!coderUser) {
      throw new Error('No coder user found')
    }
    // TODO: Handle multiple organizations
    const organizationId = coderUser.data.organization_ids[0]

    const res = await axios.get(`/organizations/${organizationId}/templates`)
    return res.data
  } catch (error) {
    console.error('Error fetching templates', error)
    throw new Error('Failed to fetch templates')
  }
}
