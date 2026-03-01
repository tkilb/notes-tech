---
id: boot-from-card-runbook
aliases: []
tags: []
---

## Reference:

https://community.frame.work/t/guide-for-installing-dual-boot-win11-linux-on-250-gb-expansion-card/38321

## Guide:

What you have described is pretty much how I set up my 11th Gen batch 1 FL13.

I got a DIY and paid for the Pro license when I purchased it.

Installed the memory, ssd, and network adapter.

On another computer, prepared a Windows installation flash drive using the Media Creation Tool.

Others have used Rufus.

Inserted the flash drive into an appropriate expansion card (USB-A) and booted right into the Windows installation process.

I wouldn’t have the 250 expansion card installed while you are setting up Windows.

Once done, used that for a day or so.

Then prepared a Ubuntu flash drive using their tools.

I also went into the BIOS and set a 10 second delay while booting.

This makes it easy to press F2 to go to BIOS, or press F12 to get to the boot menu.

Shut down the Laptop.

Insert the empty expansion card, and the Ubuntu flash drive.

Boot into the BIOS and confirm that the system sees all of the drives.

Reboot and press F12 to get to the boot menu. The flash drive should be shown, along with the Windows drive.

Let it boot from the Ubuntu flash drive and that will allow you to install Ubuntu on the expansion card.

I also have a runnable copy of Fedora on a different Flash drive.

Be careful and pay attention to the drive specifications to make sure you are installing to the correct drive. Go slow and double check!

There are knowledge base and tutorials on the Framework site

Look under the support tab, after all of the hardware guides.

I currently have mine set to default to Ubuntu, and have to choose Windows, either from the F12 boot menu, or the grub boot menu.
