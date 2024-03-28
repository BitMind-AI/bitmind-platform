import axios from '../utils/axios'

import { supabase } from '../lib/supabase'

export const fetchUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(
        `id,
      full_name,
      avatar_url,
      is_admin
    `
      )
      .order('full_name')
    if (error) throw error

    // Get Coder users
    const res = await axios.get('/users')

    // Match Coder users with profiles
    return data.map((user) => ({
      ...user,
      coder: res.data.users.find(
        (coder: any) => coder.username === user.id.split('-')[0]
      )
    }))
  } catch (error) {
    console.error('Error fetching users', error)
    throw new Error('Failed to fetch users')
  }
}

// Can only be used by Admin with `owner` Coder API key
export const createCoderUser = async (id: string) => {
  try {
    // Create Coder user
    const coderUser = await axios.post('/users', {
      disable_login: true,
      login_type: 'none',
      username: id.split('-')[0],
      email: `${id.split('-')[0]}@bitmind.ca`
    })

    // Create an API key for the Coder user
    const res = await axios.post(`/users/${coderUser.data.id}/keys/tokens`, {
      lifetime: 0,
      scope: 'all',
      token_name: `${coderUser.data.id}-api-key`
    })
    const key = await res.data.key

    // Add key to profiles table
    const { error } = await supabase
      .from('profiles')
      .update({
        coder_api_key: key
      })
      .eq('id', id)
    if (error) throw error
  } catch (error) {
    console.error('Error creating Coder user', error)
    throw new Error('Failed to create Coder user')
  }
}
