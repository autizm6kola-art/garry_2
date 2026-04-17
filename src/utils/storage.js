// // src/utils/storage.js

// import { supabase } from './supabaseClient';  // импорт клиента Supabase (предполагается, что он есть)

// const STORAGE_PREFIX = "garry_"; // можно поменять на любое название для конкретного приложения

// // Флаг: false — используем localStorage, true — Supabase
// const USE_SUPABASE = false;  // переключай на true, когда будешь готова к работе с Supabase

// // --- Реализация для localStorage ---

// const localStorageImpl = {
//   clearAllAnswers: () => {
//     const keys = Object.keys(localStorage);
//     keys.forEach((key) => {
//       if (key.startsWith(STORAGE_PREFIX)) {
//         localStorage.removeItem(key);
//       }
//     });
//   },

//   getTaskKey: (id) => `${STORAGE_PREFIX}task_answer_${id}`,

//   isTaskCorrect: (id) => {
//     return localStorage.getItem(localStorageImpl.getTaskKey(id)) === 'true';
//   },

//   saveCorrectAnswer: (id) => {
//     localStorage.setItem(localStorageImpl.getTaskKey(id), 'true');
//   },

//   migrateOldProgress: () => {
//     const keys = Object.keys(localStorage);
//     const oldProgressKeys = keys.filter(key => key.startsWith("progress_"));

//     oldProgressKeys.forEach((key) => {
//       try {
//         const data = JSON.parse(localStorage.getItem(key));
//         if (data && data.answeredTasks) {
//           Object.keys(data.answeredTasks).forEach((taskId) => {
//             localStorageImpl.saveCorrectAnswer(taskId);
//           });
//         }
//         // Можно оставить старые ключи, как ты делала
//       } catch (e) {
//         console.error("Ошибка при миграции из", key, e);
//       }
//     });
//   },

//   clearAnswersByIds: (ids) => {
//     ids.forEach((id) => {
//       localStorage.removeItem(localStorageImpl.getTaskKey(id));
//       localStorage.removeItem(`${STORAGE_PREFIX}answer_text_${id}`);
//       localStorage.removeItem(`${STORAGE_PREFIX}task_inputs_${id}`);

//       // Удаляем все подзадания (если они были)
//     let i = 0;
//     while (true) {
//       const key = `${STORAGE_PREFIX}input_correct_${id}_${i}`;
//       if (!localStorage.getItem(key)) break;
//       localStorage.removeItem(key);
//       i++;
//     }


//     });
//   },
// };

// // --- Реализация для Supabase ---

// const supabaseImpl = {
//   clearAllAnswers: async (userId) => {
//     const { error } = await supabase
//       .from('answers')
//       .delete()
//       .eq('user_id', userId);
//     if (error) console.error('Ошибка очистки ответов в Supabase:', error);
//   },

//   isTaskCorrect: async (id, userId) => {
//     const { data, error } = await supabase
//       .from('answers')
//       .select('answer_correct')
//       .eq('user_id', userId)
//       .eq('task_id', id)
//       .single();
//     if (error) {
//       console.error('Ошибка получения ответа из Supabase:', error);
//       return false;
//     }
//     return data?.answer_correct === true;
//   },

//   saveCorrectAnswer: async (id, userId) => {
//     const { error } = await supabase
//       .from('answers')
//       .upsert({ user_id: userId, task_id: id, answer_correct: true });
//     if (error) console.error('Ошибка сохранения ответа в Supabase:', error);
//   },

//   // Для миграции пока можно оставить пустую функцию или добавить логику
//   migrateOldProgress: () => {
//     // Тут пока ничего не делаем
//   },

//   clearAnswersByIds: async (ids, userId) => {
//     for (const id of ids) {
//       const { error } = await supabase
//         .from('answers')
//         .delete()
//         .eq('user_id', userId)
//         .eq('task_id', id);
//       if (error) console.error('Ошибка удаления ответа в Supabase:', error);
//     }
//   },
// };

// // --- Общий интерфейс — выбираем реализацию по флагу ---

// const storage = USE_SUPABASE ? supabaseImpl : localStorageImpl;

// // Экспортируем нужные функции

// export const clearAllAnswers = (userId) => storage.clearAllAnswers(userId);
// export const isTaskCorrect = (id, userId) => storage.isTaskCorrect(id, userId);
// export const saveCorrectAnswer = (id, userId) => storage.saveCorrectAnswer(id, userId);
// export const migrateOldProgress = (userId) => storage.migrateOldProgress(userId);
// export const clearAnswersByIds = (ids, userId) => storage.clearAnswersByIds(ids, userId);
// export const getTaskKey = localStorageImpl.getTaskKey;

// export function getSavedAnswer(taskId) {
//   const key = `${STORAGE_PREFIX}answer_text_${taskId}`;
//   return localStorage.getItem(key) || '';
// }

// export function saveAnswerText(taskId, text) {
//   const key = `${STORAGE_PREFIX}answer_text_${taskId}`;
//   localStorage.setItem(key, text);
// }

import { supabase } from './supabaseClient';

const STORAGE_PREFIX = "garry_2_";
const USE_SUPABASE = false;

// --- localStorage implementation ---

const localStorageImpl = {
  clearAllAnswers: () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },

  getTaskKey: (id) => `${STORAGE_PREFIX}task_answer_${id}`,

  isTaskCorrect: (id) => {
    return localStorage.getItem(localStorageImpl.getTaskKey(id)) === 'true';
  },

  saveCorrectAnswer: (id) => {
    localStorage.setItem(localStorageImpl.getTaskKey(id), 'true');
  },

  migrateOldProgress: () => {
    const keys = Object.keys(localStorage);
    const oldProgressKeys = keys.filter(key => key.startsWith("progress_"));

    oldProgressKeys.forEach((key) => {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (data?.answeredTasks) {
          Object.keys(data.answeredTasks).forEach((taskId) => {
            localStorageImpl.saveCorrectAnswer(taskId);
          });
        }
      } catch (e) {
        console.error("Ошибка миграции:", key, e);
      }
    });
  },

  clearAnswersByIds: (ids) => {
    ids.forEach((id) => {
      localStorage.removeItem(localStorageImpl.getTaskKey(id));
      localStorage.removeItem(`${STORAGE_PREFIX}answer_text_${id}`);
      localStorage.removeItem(`${STORAGE_PREFIX}task_inputs_${id}`);

      let i = 0;
      while (true) {
        const key = `${STORAGE_PREFIX}input_correct_${id}_${i}`;
        if (!localStorage.getItem(key)) break;
        localStorage.removeItem(key);
        i++;
      }
    });
  },

  // ---------- BACKUP / RESTORE ----------

  exportProgress: () => {
    const data = {};

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        data[key] = localStorage.getItem(key);
      }
    });

    return data;
  },

  importProgress: (data) => {
    if (!data || typeof data !== 'object') return;

    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.setItem(key, value);
      }
    });
  },
};

// --- Supabase (на будущее, не трогаем) ---

const supabaseImpl = {
  clearAllAnswers: async (userId) => {
    await supabase.from('answers').delete().eq('user_id', userId);
  },
};

// --- Switch implementation ---

const storage = USE_SUPABASE ? supabaseImpl : localStorageImpl;

// --- Exports ---

export const clearAllAnswers = () => storage.clearAllAnswers();
export const isTaskCorrect = (id) => storage.isTaskCorrect(id);
export const saveCorrectAnswer = (id) => storage.saveCorrectAnswer(id);
export const migrateOldProgress = () => storage.migrateOldProgress();
export const clearAnswersByIds = (ids) => storage.clearAnswersByIds(ids);
export const getTaskKey = localStorageImpl.getTaskKey;

export const exportProgress = () => storage.exportProgress();
export const importProgress = (data) => storage.importProgress(data);

export function getSavedAnswer(taskId) {
  return localStorage.getItem(`${STORAGE_PREFIX}answer_text_${taskId}`) || '';
}

export function saveAnswerText(taskId, text) {
  localStorage.setItem(`${STORAGE_PREFIX}answer_text_${taskId}`, text);
}
