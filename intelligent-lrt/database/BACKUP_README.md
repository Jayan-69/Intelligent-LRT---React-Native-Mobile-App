# Database Backup System

This system allows you to backup your MongoDB database to JSON files completely free of charge.

## Features

- ✅ **Free backup** - No paid services required
- ✅ **Complete data export** - All collections exported
- ✅ **Individual JSON files** - Each collection in separate file
- ✅ **Combined backup** - All data in one file
- ✅ **Restore functionality** - Import data back to database
- ✅ **Backup summary** - Detailed report of what was backed up

## Quick Start

### Windows
```bash
cd intelligent-lrt/database
run-backup.bat
```

### Mac/Linux
```bash
cd intelligent-lrt/database
chmod +x run-backup.sh
./run-backup.sh
```

### Manual
```bash
cd intelligent-lrt/database
node backup-database.js
```

## What Gets Backed Up

The backup includes all your database collections:

1. **stations** - Train station information
2. **routes** - Train routes and schedules
3. **trains** - Train details and status
4. **users** - User accounts and profiles
5. **notices** - System notices and announcements
6. **train_notices** - Train-specific notices
7. **quick_messages** - Quick message templates

## Backup Files Created

After running the backup, you'll find these files in the `backup/` directory:

- `stations.json` - Station data
- `routes.json` - Route data
- `trains.json` - Train data
- `users.json` - User data
- `notices.json` - Notice data
- `train_notices.json` - Train notice data
- `quick_messages.json` - Quick message data
- `complete-backup.json` - All data combined
- `backup-summary.json` - Backup statistics

## Restore from Backup

To restore your database from a backup:

```bash
node backup-database.js restore complete-backup.json
```

⚠️ **Warning**: This will overwrite all existing data in your database!

## Backup Location

All backup files are saved to:
```
intelligent-lrt/database/backup/
```

## Database Connection

The backup uses your existing MongoDB connection:
- **Database**: MongoDB Atlas
- **Connection**: `mongodb+srv://lrt-admin:Sj0k80NUWfvhFFPl@cluster0.ubpov8g.mongodb.net/`

## Troubleshooting

### Connection Issues
- Ensure your internet connection is stable
- Check that your MongoDB Atlas cluster is running
- Verify the connection string in `../server/.env`

### Permission Issues (Linux/Mac)
```bash
chmod +x run-backup.sh
```

### Node.js Not Found
Install Node.js from: https://nodejs.org/

## Security Notes

- Backup files contain sensitive data
- Store backup files securely
- Don't commit backup files to version control
- Consider encrypting backup files for sensitive data

## Automatic Backup

To set up automatic backups, you can:

1. **Windows Task Scheduler**: Create a scheduled task to run `run-backup.bat`
2. **Linux Cron**: Add to crontab: `0 2 * * * /path/to/run-backup.sh`
3. **Cloud Storage**: Copy backup files to Google Drive, Dropbox, etc.

## File Structure

```
intelligent-lrt/database/
├── backup-database.js      # Main backup script
├── run-backup.bat         # Windows runner
├── run-backup.sh          # Unix runner
├── backup/                # Backup files directory
│   ├── stations.json
│   ├── routes.json
│   ├── trains.json
│   ├── users.json
│   ├── notices.json
│   ├── train_notices.json
│   ├── quick_messages.json
│   ├── complete-backup.json
│   └── backup-summary.json
└── BACKUP_README.md       # This file
``` 