rm -rf dnuke-calendar/
rm -f dnuke-calendar.zip
mkdir dnuke-calendar
cp calendar.css calendar.js index.html index.js package.json  readme.md  test.js dnuke-calendar/
# tar cfz dnuke-calendar.tar.gz dnuke-calendar/
zip -r dnuke-calendar.zip dnuke-calendar/
