---
id: ssh-setup-for-vm
aliases: []
tags: []
---
#s Guide to Setting up Virt-Manager on Arch Linux Host

This guide will cover the installation of `virt-manager` on an Arch Linux host and then detail the steps for setting up two different guest scenarios: a Debian server and an Arch Linux guest.

## 1. Virt-Manager Installation on Arch Host

Before you can create virtual machines, you need to install the necessary packages and configure `libvirt`.

### 1.1 Install Packages

Open a terminal on your Arch Linux host and run the following command to install `qemu`, `libvirt`, `virt-manager`, and `dnsmasq` (often required for network bridging):

```bash
sudo pacman -S qemu libvirt virt-manager dnsmasq ebtables dmidecode bridge-utils openbsd-netcat
```

- `qemu`: The core hypervisor.
- `libvirt`: Daemon, API and management tools for managing virtualization platforms.
- `virt-manager`: A graphical interface for managing virtual machines.
- `dnsmasq`: Provides DNS and DHCP services for virtual networks.
- `ebtables`: Bridging firewall for `libvirt` networking.
- `dmidecode`: Utility for dumping DMI (SMBIOS) table contents in a human-readable format.
- `bridge-utils`: Tools for configuring Ethernet bridges.
- `openbsd-netcat`: Provides `nc` for some `libvirt` operations.

### 1.2 Start and Enable Libvirt Service

The `libvirtd` service needs to be running for `virt-manager` to function.

```bash
sudo systemctl start libvirtd.service
sudo systemctl enable libvirtd.service
```

### 1.3 Add Your User to the `libvirt` Group

To manage virtual machines as a non-root user, you need to add your user to the `libvirt` group. Replace `your_username` with your actual username.

```bash
sudo usermod -a -G libvirt your_username
```

**Important:** After adding your user to the `libvirt` group, you must **log out and log back in** (or reboot) for the changes to take effect.

## 2. General VM Creation Steps (Using Virt-Manager GUI)

Once `virt-manager` is installed and `libvirtd` is running, launch `virt-manager` from your applications menu or by typing `virt-manager` in the terminal.

1.  **Connect to QEMU/KVM:** If not already connected, right-click on "QEMU/KVM" (or "QEMU/KVM Local") and select "Connect".
2.  **Create a New Virtual Machine:** Click the "Create a new virtual machine" icon (a monitor with a star).
3.  **Choose Installation Method:**
    *   **Local install media (ISO image or CDROM):** This is the most common method. Select your downloaded ISO image for the guest OS.
    *   **Network Install (HTTP, FTP, NFS):** For network boot/install.
    *   **Import existing disk image:** If you have a pre-made VM disk.
    *   **No OS installed:** For advanced users who want to manually configure boot.
4.  **Operating System:** Specify the OS type and version. This helps `libvirt` optimize the VM settings.
5.  **Memory and CPU:** Allocate RAM and CPU cores to the VM. Start with reasonable values (e.g., 2GB RAM, 2 CPU cores) and adjust later.
6.  **Storage:** Create a disk image for your VM. You can specify the size. QCOW2 is a flexible format that grows dynamically.
7.  **Name and Finish:** Give your VM a descriptive name. Before clicking "Finish," you'll usually get a summary page. Here, you can check "Customize configuration before install" to fine-tune settings like network adapter, storage controller, etc. This is highly recommended.

### Key Customization Options (Before Install):

*   **CPUs:** Adjust core count. Can also set topology (sockets, cores, threads).
*   **Memory:** Fine-tune RAM allocation.
*   **NIC (Network Interface Card):**
    *   **Default (NAT):** This uses `libvirt`'s default NAT network, providing internet access to the guest but isolating it from your local network. This is usually sufficient for most server guests.
    *   **Bridged Adapter:** If you want your VM to appear as a separate device on your physical network and be directly accessible from other machines on your LAN, you'll need to set up a bridge on your host first. This is more advanced. For a server, this is often desired for direct SSH access from other LAN clients.
*   **Boot Options:** Ensure the correct boot device (CDROM for ISO, then disk).
*   **Display:** `Spice` is generally preferred for graphical guests; `VNC` is also an option. For server guests, you might only need a text console.

## 3. Scenario 1: Arch Host and Debian Server Guest

For a Debian server, you'll typically use a `netinst` ISO image, which is small and downloads most packages during installation.

### 3.1 Download Debian Netinst ISO

Go to the official Debian website and download the appropriate `netinst` ISO for your architecture (e.g., `debian-*-netinst.iso`).

### 3.2 VM Creation Steps (Specifics)

Follow the "General VM Creation Steps" above with these considerations:

*   **Installation Media:** Select the downloaded Debian `netinst` ISO.
*   **Operating System:** Choose "Debian" and the appropriate version.
*   **Memory/CPU:** A minimal Debian server can run on 512MB-1GB RAM and 1 CPU core, but give it more if you plan to run demanding services.
*   **Storage:** 10-20GB is usually sufficient for a basic server.
*   **Customize Configuration (Before Install):**
    *   **Network:** The "Default" (NAT) network is fine for installation and basic internet access. If you want direct SSH access from your LAN *after* installation, you might consider setting up a bridged network. However, for a quick start, NAT is easier.
    *   **Console:** For a server, the default graphical console will work, but you can also interact via serial console once the OS is installed and configured.

### 3.3 Debian Installation Process

1.  **Start the VM:** `virt-manager` will launch the VM. Follow the on-screen prompts for Debian installation.
2.  **Partitioning:** Choose guided partitioning for simplicity, or manual for custom layouts.
3.  **Software Selection:** Deselect the desktop environment if you're building a headless server. Ensure "SSH server" is selected for remote access. Standard system utilities should also be selected.
4.  **User Setup:** Create a root password and a non-root user.
5.  **Reboot:** After installation, the VM will reboot. Remove the ISO from the virtual CD drive (VM Details -> "CDROM" -> "Disconnect" or "Eject") so it boots from the virtual hard drive.

### 3.4 Post-Installation (Debian Server)

1.  **Update System:**
    ```bash
    sudo apt update
    sudo apt upgrade
    ```
2.  **Install `qemu-guest-agent`:** This improves integration with the host (e.g., graceful shutdowns, time synchronization).
    ```bash
    sudo apt install qemu-guest-agent
    sudo systemctl start qemu-guest-agent
    sudo systemctl enable qemu-guest-agent
    ```
3.  **Configure SSH:** The SSH server should be installed. If not:
    ```bash
    sudo apt install openssh-server
    ```
    To access the VM via SSH from the host if using NAT:
    *   Find the VM's IP address: `ip a` inside the guest.
    *   SSH from host: `ssh your_username@VM_IP_ADDRESS`
    *   If using bridged networking, the VM will get an IP from your LAN router.
    *   Consider setting up SSH key-based authentication for security.

## 4. Scenario 2: Arch Host and Arch Linux Guest

Installing Arch Linux requires more manual intervention.

### 4.1 Download Arch Linux ISO

Get the latest Arch Linux ISO from the official Arch Linux website.

### 4.2 VM Creation Steps (Specifics)

Follow the "General VM Creation Steps" above with these considerations:

*   **Installation Media:** Select the downloaded Arch Linux ISO.
*   **Operating System:** Choose "Arch Linux".
*   **Memory/CPU:** Allocate at least 1GB RAM and 1 CPU core, more for comfort during installation and usage.
*   **Storage:** At least 20GB recommended.
*   **Customize Configuration (Before Install):** Default settings are usually fine for the network.

### 4.3 Arch Linux Installation Process

Refer to the official Arch Linux Installation Guide (on the Arch Wiki) for detailed steps. Here's a brief outline:

1.  **Start the VM:** `virt-manager` will boot into the Arch Linux live environment.
2.  **Verify Boot Mode:** Check `ls /sys/firmware/efi/efivars` to see if booted in UEFI mode.
3.  **Connect to the Internet:** `dhcpcd` usually starts automatically. Test with `ping archlinux.org`.
4.  **Update System Clock:** `timedatectl set-ntp true`
5.  **Partition Disks:** Use `fdisk`, `cfdisk`, or `gdisk` to partition `/dev/vda` (or `sda`). Create at least a root partition and optionally a boot partition (`/boot`) and swap.
    *   Example for UEFI: EFI System Partition (e.g., `/dev/vda1`), Swap (e.g., `/dev/vda2`), Root (e.g., `/dev/vda3`).
6.  **Format Partitions:**
    ```bash
    mkfs.fat -F 32 /dev/vda1 # For EFI
    mkswap /dev/vda2
    swapon /dev/vda2
    mkfs.ext4 /dev/vda3 # For Root
    ```
7.  **Mount Partitions:**
    ```bash
    mount /dev/vda3 /mnt
    mkdir /mnt/boot
    mount /dev/vda1 /mnt/boot # If separate boot/EFI partition
    ```
8.  **Install Essential Packages:**
    ```bash
    pacstrap /mnt base linux linux-firmware vim nano
    ```
9.  **Generate `fstab`:**
    ```bash
    genfstab -U /mnt >> /mnt/etc/fstab
    ```
10. **Chroot into New System:**
    ```bash
    arch-chroot /mnt
    ```
11. **Time Zone:**
    ```bash
    ln -sf /usr/share/zoneinfo/Region/City /etc/localtime
    hwclock --systohc
    ```
12. **Localization:**
    *   Edit `/etc/locale.gen` and uncomment desired locales (e.g., `en_US.UTF-8 UTF-8`).
    *   Run `locale-gen`.
    *   Create `/etc/locale.conf` with `LANG=en_US.UTF-8`.
13. **Network Configuration:**
    *   Create `/etc/hostname` with your desired hostname.
    *   Add entries to `/etc/hosts`.
    *   Install a network manager (e.g., `networkmanager`):
        ```bash
        pacman -S networkmanager
        systemctl enable NetworkManager
        ```
14. **Root Password:**
    ```bash
    passwd
    ```
15. **Create User:**
    ```bash
    useradd -m -g users -G wheel,power -s /bin/bash your_username
    passwd your_username
    ```
    Configure `sudo` by uncommenting `%wheel ALL=(ALL) ALL` in `/etc/sudoers` using `visudo`.
16. **Install Boot Loader:**
    *   **GRUB (for UEFI):**
        ```bash
        pacman -S grub efibootmgr
        grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
        grub-mkconfig -o /boot/grub/grub.cfg
        ```
17. **Install `qemu-guest-agent`:**
    ```bash
    pacman -S qemu-guest-agent
    systemctl enable qemu-guest-agent
    ```
18. **Exit Chroot and Reboot:**
    ```bash
    exit
    umount -R /mnt
    reboot
    ```
    Remember to remove the Arch Linux ISO from the virtual CD drive in `virt-manager` after `umount -R /mnt` and before `reboot`.

### 4.4 Post-Installation (Arch Linux Guest)

1.  **Update System:**
    ```bash
    sudo pacman -Syu
    ```
2.  **Install SSH Server:**
    ```bash
    sudo pacman -S openssh
    sudo systemctl enable sshd.service
    sudo systemctl start sshd.service
    ```
    Find the VM's IP address with `ip a` and connect from your host via SSH.

This guide should provide a solid foundation for setting up `virt-manager` and your desired virtual machines. Remember to consult the official documentation for Debian and Arch Linux for more in-depth information on their respective installation processes and configurations.
