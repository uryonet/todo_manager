class Api::TodoController < ApplicationController
  before_action :set_todo, only: [:show, :update, :destroy]

  def index
    @todoes = Todo.all.order("created_at")
    render json: @todoes, status: 201
  end

  def create
    @todo = Todo.new(todo_params)
    @todo.save
    render json: @todo, status: 201
  end

  def show
    render json: @todo, status: 201
  end

  def update
    @todo.update(todo_params)
    render json: @todo, status: 201
  end

  def destroy
    @todo.destroy
    # render nothing: true, status: 204
    head :created
  end

  private

  def set_todo
    @todo = Todo.find(params[:id])
  end

  def todo_params
    params.require(:todo).permit(:title, :done)
  end
end
