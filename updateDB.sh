echo 'Updating Database'
rm -f StoryForge.db
echo 'Deleted old database'
sqlite3 StoryForge.db < create_storyforge_db.sql
echo 'Created new database: remember to repopulate data'