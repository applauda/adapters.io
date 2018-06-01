import SmartHomeService from "../../../lib/service/smarthome/SmartHomeService";

function mockRepository() {
  return {
    getDevicesForUser: async (userId: string) => ({
      a: {
        deviceId: "a",
        name: `b${userId}`,
        state: {
          on: true,
          brightness: 9,
          color: "#ffffff"
        }
      }
    }),
    updateDeviceState: jest.fn(),
    createNewDevice: jest.fn()
  };
}
function mockIothub() {
  return {
    sendCloud2DeviceMessage: jest.fn(),
    createDeviceIdentity: jest.fn()
  };
}

test("handle discovery", async () => {
  const service = new SmartHomeService(mockRepository(), mockIothub());
  const result = await service.discoverDevices("user");

  expect(Object.keys(result).length).toBe(1);
  expect(result["a"].deviceId).toBe("a");
  expect(result["a"].name).toBe("buser");
});

test("getDeviceState", async () => {
  const service = new SmartHomeService(mockRepository(), mockIothub());
  const result = await service.getDeviceState("user", ["a"]);

  expect(result).toEqual({ a: { brightness: 9, color: "#ffffff", on: true } });
});

test("registerDevice", async () => {
  const repoMock = mockRepository();
  const iotSrvMock = mockIothub();
  iotSrvMock.createDeviceIdentity.mockReturnValueOnce("00-11");

  const service = new SmartHomeService(repoMock, iotSrvMock);

  const user = "user";

  const result = await service.registerDevice(user, ["on-off"]);
  expect(iotSrvMock.createDeviceIdentity).toBeCalledWith(result.deviceId);
  expect(repoMock.createNewDevice).toBeCalledWith(
    user,
    result.deviceId,
    "00-11",
    ["on-off"]
  );
});
