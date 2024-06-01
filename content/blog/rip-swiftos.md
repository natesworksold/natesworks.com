---
external: false
draft: false
title: Oops...
description: I accidently wiped /lib
date: 2024-06-01
---

I accidently removed /lib which broke my vm... basically i misread "mv" as "rm" and instead of moving libzstd to /lib I removed /lib. Now my vm can't boot. To make this even dumber I removed my vm thinking this was unrecoverable, but now I relealised I could've kept the partition containing SwiftOS.