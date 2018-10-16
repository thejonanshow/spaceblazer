desc "Run Javascript Specs with Jest"
task :jest do
  exec('yarn run spec')
end
task default: :jest
