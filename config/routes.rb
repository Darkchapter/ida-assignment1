Assignment0::Application.routes.draw do
# Creates a :root route which redirects every webside call that only contains a / to a method named index of a controller named index
  #get "index/index"
  root :to => 'index#index'
  
  #if the URL is pages/projects_2 call controller index and action/method projects_2, the route's name is projects2 here
  get '/pages/project_2', to: 'index#project_2', as: 'project_2'

  get '/calendar', to: 'index#project_3', as: 'project_3'
end
