import { supabase } from '../supabase';

export const updateProfile = async (userId, username, fullName, bio) => {
  // console.log('Updating profile for userId:', userId);

  const { data, error } = await supabase
    .from('profiles')
    .update({
      username: username,
      full_name: fullName,
      bio: bio,
      updated_at: new Date(),
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating profile: ', error);
    return { error };
  }
  return { data };
};