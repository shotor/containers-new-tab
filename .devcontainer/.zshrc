export ZSH="$HOME/.oh-my-zsh"

ZSH_THEME="robbyrussell"

plugins=(
  sudo
)

source $ZSH/oh-my-zsh.sh

export EDITOR=vim
export LANG=en_US.UTF-8
export LANGUAGE=en_US.UTF-8
export LC_ALL=en_IE.UTF-8 # Irish uses sane formats, units and English
export QT_SELECT=6

path+=$HOME/.local/bin

alias ls='lsd'

eval "$(starship init zsh)"
