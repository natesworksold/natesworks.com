---
external: false
draft: false
title: SwiftOS development halted
description: SwiftOS development has been halted.
date: 2024-07-22
---

This post details the reason for the temporary halt of SwiftOS development.

# Why?

1. **Lack of desire:** For the past week or so I have not wanted to work on SwiftOS as I simply got bored of working on it and debugging many errors and bugs. This isn't the main reason why I halted the project for now tho.

2. **Broken install:** I have to for the **fourth** time restart development, this time I didn't lose my backups. I decided to make a new partition and install Windows on it as I wanted to play some games that are not compatible with Linux - this has turned out to be a mistake. After setting up Windows (drivers, software etc.) I decided to boot into Linux and I saw an error saying there was an unexpected inconsistity and that I should run fsck manually. So I ran fsck and it failed. After a reboot and this time it couldn't access my partition at all - maybe the UUID changed for some reason? I decided to reboot into Windows to find a program or liveiso to recover my data but when I booted Windows I was met with a Recovery Message - Linux corrupted my Windows installation?!? I tried recovering my data from archlinux's live medium, but the data was sadly corrupted.

# When is development being resumed?

I sadly cannot provide a certain date at this time, but most likely at the start of the next month SwiftOS will be bootable once again.