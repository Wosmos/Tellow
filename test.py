# import os
# import sys
# from datetime import datetime, timedelta
# import subprocess
# from pathlib import Path
# import argparse

# class GitCommitManager:
#     def __init__(self, repo_path='.'):
#         self.repo_path = Path(repo_path).resolve()
#         self.verify_git_repo()

#     def verify_git_repo(self):
#         """Verify if the directory is a git repository."""
#         if not (self.repo_path / '.git').exists():
#             raise Exception(f"Error: {self.repo_path} is not a git repository!")

#     def create_backdated_commit(self, date_str, message=None):
#         """Create a backdated commit with specified date."""
#         try:
#             # Parse the date string to datetime
#             commit_date = datetime.strptime(date_str, '%Y-%m-%d')
            
#             # Format the date for GIT_AUTHOR_DATE and GIT_COMMITTER_DATE
#             git_date_format = commit_date.strftime('%Y-%m-%d %H:%M:%S')
            
#             # Create a temporary file if it doesn't exist
#             temp_file = self.repo_path / '.temp_commit'
#             temp_file.touch()

#             # Add the file to git
#             subprocess.run(['git', 'add', '.temp_commit'], check=True)

#             # Set the environment variables for the commit date
#             env = os.environ.copy()
#             env['GIT_AUTHOR_DATE'] = git_date_format
#             env['GIT_COMMITTER_DATE'] = git_date_format

#             # Create the commit
#             commit_message = message or f"Backdated commit for {date_str}"
#             subprocess.run(
#                 ['git', 'commit', '-m', commit_message],
#                 env=env,
#                 check=True
#             )

#             # Remove the temporary file
#             temp_file.unlink()
            
#             # Remove the deleted file from git
#             subprocess.run(['git', 'add', '.temp_commit'], check=True)
#             subprocess.run(
#                 ['git', 'commit', '-m', f"Remove temporary file for {date_str}"],
#                 env=env,
#                 check=True
#             )

#             print(f"Successfully created backdated commit for {date_str}")
#             return True

#         except Exception as e:
#             print(f"Error creating backdated commit: {str(e)}")
#             return False

# def main():
#     parser = argparse.ArgumentParser(description='Create backdated Git commits')
#     parser.add_argument(
#         '--date', 
#         type=str, 
#         help='Date for the backdated commit (YYYY-MM-DD)',
#         required=True
#     )
#     parser.add_argument(
#         '--message', 
#         type=str, 
#         help='Custom commit message (optional)'
#     )
#     parser.add_argument(
#         '--repo-path', 
#         type=str, 
#         help='Path to git repository (optional, defaults to current directory)',
#         default='.'
#     )

#     args = parser.parse_args()

#     try:
#         # Create GitCommitManager instance
#         commit_manager = GitCommitManager(args.repo_path)
        
#         # Create the backdated commit
#         success = commit_manager.create_backdated_commit(args.date, args.message)
        
#         # Exit with appropriate status code
#         sys.exit(0 if success else 1)

#     except Exception as e:
#         print(f"Error: {str(e)}")
#         sys.exit(1)

# if __name__ == "__main__":
#     main()





import os
import sys
from datetime import datetime, timedelta
import subprocess
from pathlib import Path
import argparse
import random
import time
import requests
from typing import List, Dict

class GitStreakManager:
    def __init__(self, repo_path='.', github_username=None):
        self.repo_path = Path(repo_path).resolve()
        self.github_username = github_username
        self.verify_git_repo()

    def verify_git_repo(self):
        """Verify if the directory is a git repository."""
        if not (self.repo_path / '.git').exists():
            raise Exception(f"Error: {self.repo_path} is not a git repository!")

    def get_commit_times(self) -> List[str]:
        """Generate random commit times for the day to look more natural."""
        # Most developers commit between 9 AM and 11 PM
        base_hour = random.randint(9, 23)
        base_minute = random.randint(0, 59)
        base_second = random.randint(0, 59)
        return [f"{base_hour:02d}:{base_minute:02d}:{base_second:02d}"]

    def create_streak_commit(self, date_str: str, commit_count: int = 1) -> bool:
        """Create commits for the specified date to maintain streak."""
        try:
            commit_date = datetime.strptime(date_str, '%Y-%m-%d')
            
            # Get random commit times for the day
            commit_times = self.get_commit_times()
            
            for time_str in commit_times:
                # Create full datetime string
                git_date_format = f"{date_str} {time_str}"
                
                # Create temporary file with unique content
                temp_file = self.repo_path / '.github_streak'
                temp_file.write_text(f"Streak maintenance: {datetime.now().timestamp()}")

                # Stage the file
                subprocess.run(['git', 'add', '.github_streak'], check=True)

                # Set environment variables for the commit date
                env = os.environ.copy()
                env['GIT_AUTHOR_DATE'] = git_date_format
                env['GIT_COMMITTER_DATE'] = git_date_format

                # Create commit with a more natural message
                commit_messages = [
                    "Update documentation",
                    "Fix typo",
                    "Update readme",
                    "Minor changes",
                    "Update configuration",
                    "Code cleanup"
                ]
                commit_message = random.choice(commit_messages)
                
                subprocess.run(
                    ['git', 'commit', '-m', commit_message],
                    env=env,
                    check=True
                )

            print(f"Successfully created {len(commit_times)} commit(s) for {date_str}")
            return True

        except Exception as e:
            print(f"Error creating streak commit: {str(e)}")
            return False

    def verify_contribution(self, date_str: str) -> bool:
        """Verify if the commit appears in GitHub contributions."""
        if not self.github_username:
            return True  # Skip verification if username not provided
        
        try:
            # Wait for GitHub to update
            time.sleep(5)
            
            # Check GitHub contributions API
            # Note: This is a simplified check. GitHub's actual contribution graph
            # may take some time to update
            url = f"https://github.com/users/{self.github_username}/contributions"
            response = requests.get(url)
            
            if response.status_code == 200:
                return date_str in response.text
            
            return False
        except Exception:
            return False

def main():
    parser = argparse.ArgumentParser(description='Maintain GitHub Contribution Streak')
    parser.add_argument(
        '--date',
        type=str,
        help='Date for the streak commit (YYYY-MM-DD). Defaults to yesterday',
        default=(datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
    )
    parser.add_argument(
        '--repo-path',
        type=str,
        help='Path to git repository',
        default='.'
    )
    parser.add_argument(
        '--github-username',
        type=str,
        help='GitHub username for verification'
    )
    parser.add_argument(
        '--push',
        action='store_true',
        help='Automatically push commits to remote'
    )

    args = parser.parse_args()

    try:
        manager = GitStreakManager(args.repo_path, args.github_username)
        
        # Create the streak commit
        success = manager.create_streak_commit(args.date)
        
        if success and args.push:
            # Get the current branch
            current_branch = subprocess.check_output(
                ['git', 'branch', '--show-current']
            ).decode().strip()
            
            # Push changes
            subprocess.run(['git', 'push', 'origin', current_branch], check=True)
            print(f"Successfully pushed changes to {current_branch}")
            
            if args.github_username:
                print("Verifying contribution appearance...")
                if manager.verify_contribution(args.date):
                    print("✅ Contribution verified on GitHub")
                else:
                    print("⚠️ Contribution may take some time to appear on GitHub")
        
        sys.exit(0 if success else 1)

    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()