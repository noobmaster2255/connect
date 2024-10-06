import { supabase } from '../supabase';

export const updateProfile = async (userId, username, fullName, bio) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      username: username,
      full_name: fullName,
      bio: bio,
      updated_at: new Date(),  // Update the timestamp
    })
    .eq('id', userId);  // Use the logged-in user's ID

  if (error) {
    console.error('Error updating profile: ', error);
    return { error };
  }
  return { data };
};