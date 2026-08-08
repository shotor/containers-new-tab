/**
 * Remove a container identity (wipes its cookie jar).
 * @param cookieStoreId - The container's cookieStoreId.
 */
export const removeContainer = async (cookieStoreId: string): Promise<void> => {
  await browser.contextualIdentities.remove(cookieStoreId)
}
