My personal blog. Check it out at [leifblake.ca](https://www.leifblake.ca)

# To build locally

This site is built with Jekyll and the Ruby dependencies are defined in `docs/Gemfile`.

## Prerequisites (Windows)

Install Ruby + Devkit using `winget`:

```powershell
winget install --id RubyInstallerTeam.RubyWithDevKit.3.4 --source winget
```

RubyInstaller includes RubyGems (`gem`). Open a new PowerShell window after install, then verify:

```powershell
ruby --version
gem --version
```

Optional: update RubyGems:

```powershell
gem update --system
```

Install Bundler:

```powershell
gem install bundler
```

## Install dependencies

From the repo root:

```powershell
cd .\docs
bundle install
```

## Run locally

```powershell
bundle exec jekyll serve --livereload
```

Then open <http://127.0.0.1:4000>.

## Build static site

```powershell
bundle exec jekyll build
```

Generated output goes to `docs/_site`.


