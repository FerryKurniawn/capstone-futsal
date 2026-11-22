#!/bin/sh
# Pakai: sh ./switch-lb.sh rr|lc|iphash
# Ganti direktif LB di nginx.conf, lalu buat ulang container nginx (log jadi bersih).
case "$1" in
  rr) D="" ;;
  lc) D="least_conn;" ;;
  iphash) D="ip_hash;" ;;
  *) echo "pakai: sh ./switch-lb.sh rr|lc|iphash"; exit 1 ;;
esac
sed -i '/^ *\(least_conn\|ip_hash\);$/d' nginx.conf
[ -n "$D" ] && sed -i "/upstream app_backend {/a\\    $D" nginx.conf
docker compose up -d --force-recreate nginx
echo "--- isi upstream sekarang ---"
sed -n '/upstream app_backend {/,/}/p' nginx.conf
