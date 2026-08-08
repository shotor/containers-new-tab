/**
 * List all Firefox container identities.
 * @returns The container identities from the browser.
 */
export const getContainers = async (): Promise<
  browser.contextualIdentities.ContextualIdentity[]
> => browser.contextualIdentities.query({})
