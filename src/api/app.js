import supabase from '@/services/supabase'
import { useTelegram } from '@/services/telegram'
import { useScoreStore } from '@/stores/score'

const { user } = useTelegram()

const MY_ID = user?.id ?? 4252

export async function fetchTasks() {
  const { data } = await supabase.from('tasks').select('*')
  return data
}

export async function getOrCreateUser(refId = null, userName = null) {
  // Check if the user exists
  const { data: potentialUser } = await supabase
    .from('users')
    .select()
    .eq('telegram', MY_ID);

  if (potentialUser.length !== 0) {
    return potentialUser[0];
  }

  const defaultTimers = {
    eat: { startTime: null, remaining: 0 },
    walk: { startTime: null, remaining: 0 },
  };

  const newUser = {
    telegram: MY_ID,
    friends: {},
    tasks: {},
    score: 0,
    timers: defaultTimers,
  };

  const { data: createdUser, error } = await supabase
    .from('users')
    .insert(newUser)
    .select();

  if (error) {
    console.error("Error creating user:", error);
    return null;
  }

  const user = createdUser[0];

  // If a referral ID is specified, register the referral
  if (refId && userName) {
    await registerRef(userName, refId);
  }

  return user;
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
