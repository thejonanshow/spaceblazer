source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.5.0'

gem 'rails', '~> 5.2.1'
gem 'pg', '>= 0.18', '< 2.0'
gem 'puma', '~> 3.11'
gem 'sass-rails', '~> 5.0'
gem 'coffee-rails', '~> 4.2'
gem 'uglifier', '>= 1.3.0'
gem 'jbuilder', '~> 2.5'
gem 'redis', '~> 4.0'
gem 'sidekiq', '~> 5.2'
gem 'bootsnap', '>= 1.1.0', require: false
gem 'webpacker', git: 'https://github.com/rails/webpacker.git'
gem 'newrelic_rpm'

group :development, :test do
  gem 'pry-byebug', '~> 3.6'
  gem 'rspec-rails', '~> 3.8'
  gem 'dotenv-rails', '~> 2.5'
end

group :development do
  gem 'web-console', '~> 3.7'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring', '~> 2.0'
  gem 'spring-watcher-listen', '~> 2.0.0'
end
