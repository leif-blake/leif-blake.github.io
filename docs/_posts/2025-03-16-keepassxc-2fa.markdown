---
layout: post
title:  "Exploring 2FA in KeePassXC"
date:   2025-03-16 23:00:00 -0400
---

## Introduction

I use [KeePassXC](https://keepassxc.org/) for many of my more sensitive passwords. It's an open-source project for both desktop and mobile which can open the KDBX database file format. For convenience, I store the KDBX file in cloud storage. Despite using a [diceware](https://xkcd.com/936/) password, I'm somewhat concerned about the strength of my password should someone get their hands on the database. After all, computer power is only increasing, and once someone has the database there's no limit on how quickly they can throw guesses at it. It's just a file after all.

Like any somewhat security-conscious individual, I immediately looked to implement 2FA on my database. There is a plugin for KeePass2, which I was originally using, but its development is seemingly abandoned and for reasons I won't go into here, it doesn't provide substantial improvements in security, puts your Yubikey secret at risk, and [does things that could be categorized as security theatre](https://support.keepassium.com/kb/yubikey-keechallenge/).

Luckily, KeePassXC provides a method to use the HMAC-SHA1 Challenge-Response feature of a Yubikey. Once set up, in order to unlock your database, you must first plug in your Yubikey and tap the capacitive button when prompted, in addition to entering your password. It even works on mobile through the NFC feature of newer Yubikeys!

Some quick searches, however, reveal that calling this decryption flow "2FA" is somewhat controversial. The developers of KeePassXC themselves [explicitly state in their FAQ](https://keepassxc.org/docs/) that this is not 2FA, and they have weighed in with detail on the [debate](https://security.stackexchange.com/questions/201345/is-it-reasonable-to-use-keepassxc-with-yubikey) over this feature's security. I'm making use of their explanation, as well as my own debugging of the KeePassXC application, for this post.

## How KeePassXC uses YubiKey

KDBX files contain a master seed in their plaintext header. After a user enters their password, KeePassXC sends this master seed to the YubiKey as a [challenge](https://docs.yubico.com/yesdk/users-manual/application-otp/challenge-response.html). When the user touches the Yubikey, it combines this challenge with a 20-byte read-only secret, and uses the SHA-1 hashing algorithm to produce a Hash-Based One Time Password (HOTP) as a response. There are a couple important things to note here.

1. Despite many vulnerabilities having been found in the SHA-1 algorithm, it's ok to use here. The problem with SHA-1 is that there are better-than-brute-force ways to produce a desired output, meaning that it shouldn't be used to sign documents, since their contents could be altered and the same signature re-produced. In this application however, the output of the hash is itself a password, so the risk is that someone could take this output and determine the input (the YubiKey's seceret). SHA-1 is still secure in this regard.
2. I'm using the term HOTP here since this is what yubico calls it, but strictly speaking it is not one-time, since **the master seed does not change between successive decryptions of the database.**

Once KeePass has the HOTP and the user's password, it combines them along with the master seed, hashes the result, and uses this to unlock the database. This flow is shown below:

![A diagram showing the decryption flow with Yubikey in KeePassXC]({{site.baseurl}}/assets/images/KeePassXC-Decryption.png)

Now, when it comes time to save the database, KeePassXC generates a new random master seed, and uses the password it already has stored in memory. However, since the master seed has changed, and KeePassXC has no knowledge of the YubiKey's secret, it needs to sends the new master seed as a challenge to get a fresh HOTP.

![A diagram showing the encryption flow with Yubikey in KeePassXC]({{site.baseurl}}/assets/images/KeePassXC-Encryption.png)


## Why this isn't 2FA

As the developers of KeePassXC point out, this flow doesn't even describe an *Authentication* process, let alone one with multiple factors. In a normal 2FA scheme, the authenticator requests a piece of knowledge from the user, such as a Time-Based One Time Password (TOTP), that the user generates from a secret stored on a device. The authenticator must also have this secret (or a public key in asymmetric schemes), and they can use it to prove the user has knowledge of the secret. The device on which this secret is stored becomes a second factor.

KDBX databases are not authenticators. They're simply files containing encrypted data. In this flow, there is no third party who can be trusted to hold the shared 2FA secret, or whose job it is to verify the user's identity. Any data in the database that is usable *before* decryption is available and modifiable to anyone trying to unlock the database, including an attacker.

Also, as mentioned above, the master seed does not change between successive decryptions of the file. This means that the response from the YubiKey doesn't change either. Indeed, because the database is not an authenticator, this response *must* be consistent between decryptions. Hence, the YubiKey cannot be considered a second factor in the strictest sense. Unlike with TOTP or other 2FA solutions, **you do not need knowledge of the secret embedded in the YubiKey** in order to unlock the database, only knowledge of the response that it provides. This means that the response from the YubiKey is functionally just a second password stored on the YubiKey, albeit one you don't need to remember, and which changes every time the database is modified.

## Why I'm still using it

A 5-word, 5-dice diceware password provides about 64 bits of security, which makes it just slightly harder to guess than 10 random characters, including upper and lower case, numbers, and the symbols in the numbers row. This is decent, but if someone were to get their hands on my KDBX datastore, it wouldn't last all that long to brute force attacks.

Adding a YubiKey as pseudo-2FA provides a second password with 160 bits of security (from the 20 byte secret on the YubiKey). Together, these passwords amount to 224 bits of security, approaching the 256-bit limit imposed by the output of the SHA-256 hash used to produce the final key in KeePassXC, which is then used to decrypt the database. This makes my database significantly more secure, and allows me to keep my password simple to remember. 

In practice, to unlock my database you need to know my password and have possession of my YubiKey. If someone is able to extract the response from the YubiKey, such as through malware installed on my computer, it's likely I have bigger problems on my hands.
