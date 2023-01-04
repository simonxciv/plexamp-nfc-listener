# NFC Listener for Plexamp

> A basic Node app to listen for and dispatch NFC tag reads to a Plexamp companion player.

---

## Prerequisites

1. An NFC card reader is required. This project was tested and works well with the ACR122U USB NFC reader.
2. NodeJS should be installed. I recommend using [Volta](https://volta.sh/) to manage this.
3. Some blank NFC tags to write to from within Plexamp.

## Installation

1. Clone this repository to a location of your choice
2. Run `npm install` to download and install the project's dependencies
3. Copy `example.settings.json` to `settings.json`, and configure as described below under _Configuration_
4. Run `npm run start` to start the application. After a few moments, you should see a message similar to the one below, indicating your reader was detected successfully, and you can begin swiping your cards:

```
ACS ACR122U PICC Interface 00 00 device attached
```

## Configuration

This application provides several configuration options, as below:

- **playerIP**: The IP address of the Plexamp player you wish to control _(string)_
- **playerPort**: The port of the Plexamp player _(number)_
- **pauseOnCardRemoval**: Whether to automatically pause playback when the NFC card is removed from the reader _(boolean)_
- **resumeOnCardPlacement**: Attempt to resume playback when the most recently played NFC tag is re-placed on the reader _(boolean)_

## Usage

From within Plexamp, you can write to blank NFC tags via the **Share** menu on compatible mobile devices. Ensure the URL being written to the tag is for Playback (not browsing) by using the icon to the right of the menu entry.

Once written, swiping this card on a configured NFC reader running this application allows for the automatic control of remote or local Plexamp players.

## Troubleshooting

This project has been tested with the ACR122U card reader under Linux, but should also work on other platforms, assuming a correctly configured device. If you're having trouble getting the ACR122U working correctly under Linux, try the guide below:

https://wiki.archlinux.org/title/Touchatag_RFID_Reader

The below NFC tags were tested and work well:

https://www.amazon.com.au/dp/B08LGV6BZ6?ref=ppx_yo2ov_dt_b_product_details&th=1
