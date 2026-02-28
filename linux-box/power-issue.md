- I am using arch linux with Gnome desktop
- My computer goes back to sleep shortly after waking
- Last time this happened was around Feb 27th, at 5:07pm

✦ I will read /etc/default/grub to see if nvidia_drm.fbdev=1 is already included
in the kernel parameters.

╭──────────────────────────────────────────────────────────────────────────╮
│ ✓ Shell cat /etc/default/grub [current working directory /home/tylerki… │
│ │
│ #GRUB_INIT_TUNE="480 440 1" │
│ │
│ # Uncomment to make GRUB remember the last selection. This requires │
│ # setting 'GRUB_DEFAULT=saved' above. │
│ #GRUB_SAVEDEFAULT=true │
│ │
│ # Uncomment to disable submenus in boot menu │
│ GRUB_DISABLE_SUBMENU='false' │
│ │
│ # Probing for other operating systems is disabled for security reasons. │
│ Read │
│ # documentation on GRUB_DISABLE_OS_PROBER, if still want to enable this │
│ # functionality install os-prober and uncomment to detect and include │
│ other │
│ # operating systems. │
╰──────────────────────────────────────────────────────────────────────────╯
✦ Based on the system logs from February 27th at 5:07 PM, the issue where your
computer goes back to sleep shortly after waking is caused by a chain of
hardware initialization failures that trigger GNOME's automatic suspend logic.

Root Cause Analysis

1.  Multiple Hardware Resume Failures:
    - GPU (NVIDIA): Right after waking (17:07:07), the kernel reports an Xid
      69 error and GNOME Shell logs a Page flip failed: drmModeAtomicCommit:
      Invalid argument. This typically results in a blank or frozen screen
      immediately after resume.
    - USB (Edifier G2000 Speakers): The kernel repeatedly fails to read the
      device descriptor for the speakers on Port 4 (error -32 and error -71),
      causing the USB hub to attempt power cycles and resets.
    - DDR5 Sensors: The spd5118 temperature sensors also fail to resume
      correctly (error -6).
2.  Re-Suspend Trigger:
    - Because the GPU fails to initialize the display, GNOME thinks the
      monitor is off.
    - Simultaneously, the USB hub resets caused by the speakers likely
      disconnect your keyboard/mouse for several seconds.
    - GNOME (specifically GDM or the lock screen) sees a blank screen and no
      user activity, so it assumes the wake-up was "spurious" or the system
      is idle and sends a new Suspend command to systemd-logind within 15-30
      seconds.

Recommended Fixes

1. Fix NVIDIA Page Flip Error
   Add the nvidia_drm.fbdev=1 parameter to your GRUB configuration. This is a
   common fix for the "Page flip failed" error on NVIDIA + Wayland.

- Edit /etc/default/grub and update the GRUB_CMDLINE_LINUX_DEFAULT line to:
  GRUB_CMDLINE_LINUX_DEFAULT='nowatchdog nvme_load=YES nvidia_drm.modeset=1
  nvidia_drm.fbdev=1 loglevel=3'
- Update GRUB: sudo grub-mkconfig -o /boot/grub/grub.cfg
- Reboot.

2. Address the USB Speaker Issue
   The EDIFIER G2000 speakers are failing to initialize and causing hub resets.

- Try plugging the speakers into a different USB port (preferably a direct
  motherboard port rather than a hub).
- Test waking the system with the speakers unplugged to see if the re-sleep
  behavior stops.

3. Fix Toshy (Key Remapper)
   Your logs show Toshy is failing to start because it's looking for
   libpython3.13.so.1.0 which is missing or has been updated on your system.
   Since Toshy remaps your keys, its failure might prevent you from successfully
   sending input to "stay awake" after resume.

- You likely need to update or recreate the Toshy virtual environment:
  cd ~/.config/toshy && python -m venv --clear .venv (and then re-run its
  setup script).

4. Systemd Sleep Freeze Setting
   Your system has an "explicit request" setting
   SYSTEMD_SLEEP_FREEZE_USER_SESSIONS=false (located in
   /usr/lib/systemd/system/systemd-suspend.service.d/10-nvidia-no-freeze-session.
   conf). While this is intended to help NVIDIA drivers, it allows GNOME to
   remain active and trigger the re-suspend while the hardware is still
   struggling to wake up. Fixing the GPU and USB issues above should make this
   setting unnecessary to change.
