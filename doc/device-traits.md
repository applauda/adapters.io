# Device traits

Depending on the chosen device traits, you have to implement the commands on your end device. Each device trait has its own command.

| Device Trait     | Description             | Command | Parameter | Example  |
| ---------------- | ----------------------- |:-------:| --------- | -------- |
| "on-off"         | Turn device on/off      | s       | 0/1       | s0       |
| "brightness"     | Adjust brightness level | b       | 0-100     | b56      |
| "color-spectrum" | Change color            | c       | #rrggbb   | s#ff0000 |

The commands will be send to the `IotHubService#sendCloud2DeviceMessage` function. From there you can pass it to your end device and implement the commands.

To extend the library with more device traits, take a look at the [development document](./development.md).
