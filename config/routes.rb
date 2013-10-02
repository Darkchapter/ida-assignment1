Assignment0::Application.routes.draw do
# Creates a :root route which redirects every webside call that only contains a / to a method named index of a controller named index
  #get "index/index"  
  root :to => 'index#index'
end
