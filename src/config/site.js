/**
 * Site-wide configuration flags.
 * 
 * REVERT INSTRUCTIONS:
 * When GHL + AI are activated, change aiActive to true and rebuild.
 * This will restore all hero/widget popups to their original AI chat/call state,
 * and the get-started page will need the GHL calendar embed code added.
 */
export const SITE_CONFIG = {
  /** Set to true when GHL is set up and AI receptionist is live */
  aiActive: false,
};
