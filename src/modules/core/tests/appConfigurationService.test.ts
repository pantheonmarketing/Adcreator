import { describe, it, expect, beforeEach } from "vitest";
import { deleteAppConfiguration, getAppConfiguration } from "../services/AppConfigurationService";
import { defaultAppConfiguration } from "../data/defaultAppConfiguration";

describe(`[${defaultAppConfiguration.app.orm}] appConfigurationService`, () => {
  it(`app name should have value`, async () => {
    const appConfiguration = await getAppConfiguration();
    expect(appConfiguration.app.name).not.toBeNull();
  });
  it(`should delete but return not null`, async () => {
    await deleteAppConfiguration();
    const appConfiguration = await getAppConfiguration();
    expect(appConfiguration).not.toBeNull();
  });
});
