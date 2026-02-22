---
id: nas-setup
aliases: []
tags: []
---

# Facts and Requirements

- User is using Arch Linux
- User has a NAS (Network Attached Storage) device that they want to set up and access
- User wants the NAS to automatically mount on boot
- NAS is using the SMB/CIFS protocol for file sharing
- User wants to access the NAS using a specific username and password
- User wants the credentials to be stored securely
- Instructions should be provide at the bottom of this markdown file

# Instructions

## Prerequisites

- NAS IP address or hostname
- NAS share name
- SMB username and password
- Local mount point directory

## Step 1: Install Required Packages

```bash
sudo pacman -S cifs-utils
```

## Step 2: Create Mount Point

```bash
sudo mkdir -p /mnt/nas
```

Replace `/mnt/nas` with your preferred mount point.

## Step 3: Create Credentials File

Store credentials securely in a dedicated file:

```bash
sudo mkdir -p /etc/smb
sudo nano /etc/smb/credentials
```

Add the following content:

```
username=your_smb_username
password=your_smb_password
```

Secure the file:

```bash
sudo chmod 600 /etc/smb/credentials
sudo chown root:root /etc/smb/credentials
```

## Step 4: Test the Mount

Test mounting manually before adding to fstab:

```bash
sudo mount -t cifs //NAS_IP_ADDRESS/SHARE_NAME /mnt/nas -o credentials=/etc/smb/credentials
```

Verify it works:

```bash
df -h | grep nas
ls /mnt/nas
```

Unmount when done testing:

```bash
sudo umount /mnt/nas
```

## Step 5: Add to fstab for Auto-Mount

Edit `/etc/fstab`:

```bash
sudo nano /etc/fstab
```

Add the following line:

```
//NAS_IP_ADDRESS/SHARE_NAME  /mnt/nas  cifs  credentials=/etc/smb/credentials,iocharset=utf8,file_mode=0777,dir_mode=0777,uid=1000,gid=1000  0  0
```

**Options explained:**

- `credentials=/etc/smb/credentials` - Path to secure credentials file
- `iocharset=utf8` - Character encoding
- `file_mode=0777,dir_mode=0777` - Default permissions
- `uid=1000,gid=1000` - Set ownership to your user (check with `id`)

## Step 6: Test fstab Configuration

Test without rebooting:

```bash
sudo mount -a
```

If no errors appear, verify the mount:

```bash
df -h | grep nas
```

## Troubleshooting

**Mount fails on boot:** Add `x-systemd.automount,noauto` to fstab options for network-dependent mounts:

```
//NAS_IP_ADDRESS/SHARE_NAME  /mnt/nas  cifs  credentials=/etc/smb/credentials,iocharset=utf8,file_mode=0777,dir_mode=0777,uid=1000,gid=1000,x-systemd.automount,noauto  0  0
```

**Permission issues:** Adjust `uid` and `gid` to match your user ID (find with `id -u` and `id -g`).

**DNS resolution:** Use the NAS IP address instead of hostname in fstab to avoid boot issues.
