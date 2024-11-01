import os
import sys
from datetime import datetime, timedelta
import subprocess
from pathlib import Path
import argparse

class GitCommitManager:
    def __init__(self, repo_path='.'):
        self.repo_path = Path(repo_path).resolve()
        self.verify_git_repo()

    def verify_git_repo(self):
        """Verify if the directory is a git repository."""
        if not (self.repo_path / '.git').exists():
            raise Exception(f"Error: {self.repo_path} is not a git repository!")

    def create_backdated_commit(self, date_str, message=None):
        """Create a backdated commit with specified date."""
        try:
            # Parse the date string to datetime
            commit_date = datetime.strptime(date_str, '%Y-%m-%d')
            
            # Format the date for GIT_AUTHOR_DATE and GIT_COMMITTER_DATE
            git_date_format = commit_date.strftime('%Y-%m-%d %H:%M:%S')
            
            # Create a temporary file if it doesn't exist
            temp_file = self.repo_path / '.temp_commit'
            temp_file.touch()

            # Add the file to git
            subprocess.run(['git', 'add', '.temp_commit'], check=True)

            # Set the environment variables for the commit date
            env = os.environ.copy()
            env['GIT_AUTHOR_DATE'] = git_date_format
            env['GIT_COMMITTER_DATE'] = git_date_format

            # Create the commit
            commit_message = message or f"Backdated commit for {date_str}"
            subprocess.run(
                ['git', 'commit', '-m', commit_message],
                env=env,
                check=True
            )

            # Remove the temporary file
            temp_file.unlink()
            
            # Remove the deleted file from git
            subprocess.run(['git', 'add', '.temp_commit'], check=True)
            subprocess.run(
                ['git', 'commit', '-m', f"Remove temporary file for {date_str}"],
                env=env,
                check=True
            )

            print(f"Successfully created backdated commit for {date_str}")
            return True

        except Exception as e:
            print(f"Error creating backdated commit: {str(e)}")
            return False

def main():
    parser = argparse.ArgumentParser(description='Create backdated Git commits')
    parser.add_argument(
        '--date', 
        type=str, 
        help='Date for the backdated commit (YYYY-MM-DD)',
        required=True
    )
    parser.add_argument(
        '--message', 
        type=str, 
        help='Custom commit message (optional)'
    )
    parser.add_argument(
        '--repo-path', 
        type=str, 
        help='Path to git repository (optional, defaults to current directory)',
        default='.'
    )

    args = parser.parse_args()

    try:
        # Create GitCommitManager instance
        commit_manager = GitCommitManager(args.repo_path)
        
        # Create the backdated commit
        success = commit_manager.create_backdated_commit(args.date, args.message)
        
        # Exit with appropriate status code
        sys.exit(0 if success else 1)

    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()