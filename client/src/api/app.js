import supabase from '@/services/supabase'
import { useTelegram } from '@/services/telegram'
import { useScoreStore } from '@/stores/score'

const { user } = useTelegram()

const MY_ID = user?.id ?? 4252
const USERNAME = user?.username ?? 'unknown'
const FIRSTNAME = user?.first_name ?? 'unknown'

export async function fetchTasks() {
  const { data } = await supabase.from('tasks').select('*')
  return data
}

export async function getOrCreateUser(refId = null, userName = null) {
  const { data: potentialUser, error: userFetchError } = await supabase
    .from('users')
    .select('*')
    .eq('telegram', MY_ID);

  if (userFetchError) {
    console.error('Error fetching user:', userFetchError);
    throw userFetchError;
  }

  if (potentialUser.length !== 0) {
    return potentialUser[0];
  }

  const newUser = {
    telegram: MY_ID,
    username: USERNAME,
    first_name: FIRSTNAME,
    friends: {},
    tasks: {},
    score: 0,
    pet: {
      id: null,
      name: null,
      type: null
    }, // Питомец добавляется как null
    timers: { eat: { startTime: null, remaining: 0 }, walk: { startTime: null, remaining: 0 } },
  };

  const { data: createdUser, error } = await supabase
    .from('users')
    .insert(newUser)
    .select();

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }

  if (refId && userName) {
    await registerRef(userName, refId);
  }

  return createdUser[0];
}

export async function fetchPet() {
  const { data, error } = await supabase
    .from('users')
    .select('pet')
    .eq('telegram', MY_ID)
    .single();

  if (error || !data) {
    console.error('Ошибка получения питомца:', error);
    return null;
  }

  return data.pet;
}



export async function savePet(pet) {
  const petData = {
    id: pet.id,
    name: pet.name,
    type: pet.type,
  };

  const { data, error } = await supabase
    .from('users')
    .update({ pet: petData })
    .eq('telegram', MY_ID);

  if (error) {
    console.error('Error saving pet:', error);
    throw error;
  }

  return data;
}

export async function updateScore(score) {
  await supabase.from('users').update({ score }).eq('telegram', MY_ID)
}

export async function registerRef(userName, refId) {
  const { data } = await supabase.from('users').select().eq('telegram', +refId)

  const refUser = data[0]

  await supabase
    .from('users')
    .update({
      friends: { ...refUser.friends, [MY_ID]: userName },
      score: refUser.score + 50,
    })
    .eq('telegram', +refId)
}

export async function completeTask(user, task) {
  const score = useScoreStore()
  const newScore = score.score + task.amount
  score.setScore(newScore)

  await supabase
    .from('users')
    .update({
      tasks: { ...user.tasks, [task.id]: true },
      score: newScore,
    })
    .eq('telegram', MY_ID)
}

export async function saveTimers(userId, timers) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ timers })
      .eq('id', userId);

    if (error) {
      console.error('Error saving timers:', error);
      throw error;
    }
    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

export async function updateTimers(newTimerData) {
  try {

    const currentTimers = await fetchUserTimers();

    // Update only the changed values
    const updatedTimers = {
      ...currentTimers,
      ...newTimerData,
    };

    // Save the updated timers back to the database
    const { data, error } = await supabase
      .from('users')
      .update({ timers: updatedTimers })
      .eq('telegram', MY_ID);

    if (error) {
      console.error('Error updating timers:', error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error during timers update:', err);
  }
}

export async function fetchUserTimers() {
  const { data } = await supabase
    .from('users')
    .select('timers')
    .eq('telegram', MY_ID)
    .single();

  return data?.timers || {};
}

export async function fetchLeaderboard() {
  const { data: users, error } = await supabase
    .from('users')
    .select('first_name, score')
    .order('score', { ascending: false }) 
    .limit(100);

  if (error) {
    console.error('Error when retrieving leaderboard data:', error);
    return [];
  }

  
  const leaderboard = users.map((player) => {
    return {
      ...player,
      username: getUserNameById(player.telegram),
    };
  });

  return leaderboard;
}


function getUserNameById(telegramId) {
  if (!telegramId) return 'Unknown user';

  const { user } = useTelegram();


  if (user?.id === telegramId) {
    return user?.username || `${user?.first_name} ${user?.last_name || ''}`;
  }


  return `User-${telegramId}`;
}


export async function dailyCheckIn() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, score, last_check_in, check_in_count')
      .eq('telegram', MY_ID)
      .single();

    if (userError || !user) {
      console.error('Error fetching user for daily check-in:', userError);
      throw userError;
    }

    // Check if the user has checked in today
    if (user.last_check_in === today) {
      return { success: false, message: "You've already checked in today!" };
    }

    // Reset the check-in count if it’s the 8th day
    const isEighthDay = (user.check_in_count % 7) === 0 && user.check_in_count > 0;
    const newCheckInCount = isEighthDay ? 1 : user.check_in_count + 1;

    // Calculate reward for the day
    const currentDay = isEighthDay ? 1 : (user.check_in_count % 7) + 1; // Days within the current cycle
    const rewardMultiplier = Math.pow(1.5, currentDay - 1); // Progressive increase
    const rewardPoints = Math.round(10 * rewardMultiplier);

    // Update user data
    const newScore = user.score + rewardPoints;

    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        score: newScore, 
        last_check_in: today, 
        check_in_count: newCheckInCount 
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating user check-in:', updateError);
      throw updateError;
    }

    return { 
      success: true, 
      message: `Check-in successful! You've earned ${rewardPoints} points today! Your new score: ${newScore}.`,
      checkInCount: newCheckInCount,
      reset: isEighthDay, // Indicates that the cycle has been reset
    };
  } catch (err) {
    console.error('Unexpected error during daily check-in:', err);
    return { success: false, message: "There's been an error. Try again later." };
  }
}

export async function fetchUserData() {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('last_check_in, check_in_count')
      .eq('telegram', MY_ID)
      .single();

    if (error) {
      console.error('Error retrieving user data:', error);
      throw error;
    }

    return user;
  } catch (err) {
    console.error('Unexpected error when loading user data:', err);
    throw err;
  }
}

export async function saveWalletAddress(wallet) {
  const { error } = await supabase
    .from('users')
    .update({ wallet })
    .eq('telegram', MY_ID);

  if (error) {
    throw new Error(`Failed to save wallet address: ${error.message}`);
  }
}



export async function fetchFriendPet(friendTelegramId) {
  const { data, error } = await supabase
    .from('users')
    .select('pet')
    .eq('telegram', friendTelegramId)
    .single();

  if (error) {
    console.error('Error fetching friend pet:', error);
    return null;
  }

  return data?.pet || null;
}
