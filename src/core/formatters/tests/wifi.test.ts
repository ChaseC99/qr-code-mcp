import { describe, it, expect } from "vitest";
import { formatWiFi } from "../wifi.js";

describe("formatWiFi", () => {
  it("formats WPA network with password", () => {
    expect(
      formatWiFi({ ssid: "MyNetwork", password: "secret123", encryption: "WPA" }),
    ).toBe("WIFI:T:WPA;S:MyNetwork;P:secret123;;");
  });

  it("formats open network without password", () => {
    expect(formatWiFi({ ssid: "FreeWiFi", encryption: "nopass" })).toBe(
      "WIFI:T:nopass;S:FreeWiFi;;",
    );
  });

  it("formats hidden network", () => {
    expect(
      formatWiFi({
        ssid: "Hidden",
        password: "pass",
        encryption: "WPA",
        hidden: true,
      }),
    ).toBe("WIFI:T:WPA;S:Hidden;P:pass;H:true;;");
  });

  it("formats WEP network", () => {
    expect(
      formatWiFi({ ssid: "OldNet", password: "wepkey", encryption: "WEP" }),
    ).toBe("WIFI:T:WEP;S:OldNet;P:wepkey;;");
  });

  it("escapes special characters in SSID and password", () => {
    expect(
      formatWiFi({
        ssid: 'My;Net:"work',
        password: "p\\a;ss,w:ord",
        encryption: "WPA",
      }),
    ).toBe('WIFI:T:WPA;S:My\\;Net\\:\\"work;P:p\\\\a\\;ss\\,w\\:ord;;');
  });
});
