# router 
## setup the router
### enable router
enable
### start configuration terminal
conf t
### Select the interface
int gig0/0
### Give an IP address and configuration
ip address 172.16.0.0 255.255.255.0
### Make sure it stays ON
no shutdown
## DHCP (as conf t)
### Create a pool to give all the IPs
ip dhcp pool lan1
### Add the network
network 172.16.0.0 255.255.255.0
### Add a router for everyone
default-router 172.16.0.1
### Setup DNS
dns-server 172.16.0.10
## Verification
## In the desktop
- Activate DHCP
- Make sure it has a dynamic address
## Links
# Wifi
- Connect any port that is not 0/0 (because 0/0 is the internet port of the wifi)
- GUI > IP: 172.16.0.254 (last one because we want static IP address for it)
# Adding the servers