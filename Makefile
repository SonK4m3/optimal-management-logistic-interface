deploy-dev:
	rsync -avhzL \
		--no-perms --no-owner --no-group \
		--exclude .git \
		--filter=":- .gitignore" \
		. sotatek@172.16.198.33:/home/sotatek/workspace/trading-bot-fe
