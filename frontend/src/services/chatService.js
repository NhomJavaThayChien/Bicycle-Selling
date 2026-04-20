import api from "./api";

const CONVERSATION_CACHE_KEY = "chat_conversations_cache";

const readConversationCache = () => {
  const raw = localStorage.getItem(CONVERSATION_CACHE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeConversationCache = (items) => {
  localStorage.setItem(CONVERSATION_CACHE_KEY, JSON.stringify(items));
};

export const getCachedConversations = () => {
  const items = readConversationCache();

  return [...items].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
};

export const upsertCachedConversation = (conversation) => {
  const items = readConversationCache();
  const index = items.findIndex(
    (item) => item.conversationId === conversation.conversationId,
  );

  const nextItem = {
    ...conversation,
    updatedAt: conversation.updatedAt || new Date().toISOString(),
  };

  if (index >= 0) {
    items[index] = { ...items[index], ...nextItem };
  } else {
    items.unshift(nextItem);
  }

  writeConversationCache(items);
  return nextItem;
};

export const createOrGetConversation = async ({
  otherUserId,
  listingId,
  otherUsername,
}) => {
  const response = await api.post("/conservation", null, {
    params: {
      otherUserId,
      listingId,
    },
  });

  const payload = response.data || {};

  upsertCachedConversation({
    conversationId: payload.conversationId,
    listingId,
    otherUserId,
    otherUsername: otherUsername || "Unknown user",
    updatedAt: new Date().toISOString(),
  });

  return payload;
};

export const getMessages = (conversationId) =>
  api.get(`/chat/conversations/${conversationId}/messages`);

export const sendMessage = (data) => {
  upsertCachedConversation({
    conversationId: data.conversationId,
    updatedAt: new Date().toISOString(),
  });

  return api.post("/chat/messages", data);
};

export const markConversationRead = (conversationId) =>
  api.post(`/chat/conversations/${conversationId}/read`);
