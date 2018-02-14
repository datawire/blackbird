#!/usr/bin/env bash

set -u

main() {
    local _ansi_escapes_are_valid=false
    if [ -t 2 ]; then
        if [ "${TERM+set}" = 'set' ]; then
            case "$TERM" in
                xterm*|rxvt*|urxvt*|linux*|vt*)
                    _ansi_escapes_are_valid=true
                ;;
            esac
        fi
    fi

    need_cmd curl
    need_cmd kubectl
    need_cmd git

    local _install_dir=$(pwd)/blackbird

    say_info $_ansi_escapes_are_valid "Uninstalling the Datawire Reference Architecture."

    # Remove Forge
    say_info $_ansi_escapes_are_valid "Uninstalling Forge."
    ensure sudo rm -rf /usr/local/bin/forge

    # Uninstall Telepresence

    # Detect if macOS, Ubuntu or Fedora
    local _platform="$(uname | tr "[:upper:]" "[:lower:]")"
    if [[ "$_platform" == "linux" ]]; then
      say_info $_ansi_escapes_are_valid "Detected Linux"
      case $(lsb_release -d) in
        *Ubuntu*)
          say_info $_ansi_escapes_are_valid "Detected Ubuntu"
          ensure apt remove telepresence
          ;;
        *Fedora*)
          say_info $_ansi_escapes_are_valid "Detected Fedora"
          ensure sudo -s dnf remove telepresence
          ;;
        *)
          err "Telepresence not supported on this OS!"
      esac
    elif [[ "$_platform" == "darwin" ]]; then
      say_info $_ansi_escapes_are_valid "Detected macOS"
      need_cmd brew
      ensure brew uninstall telepresence --force
      ensure brew cask uninstall osxfuse
      ensure brew uninstall socat --force
    else
      err "Operating System not supported. Only macOS and Linux are supported!"
    fi


    # --------------------------------------------------------------------------
    # kubernetes cluster uninstall
    # --------------------------------------------------------------------------

    say_info $_ansi_escapes_are_valid "Removing the Reference Architecture from your Kubernetes cluster"

    ensure kubectl delete ns datawire

    echo ""
    say 'The Datawire Reference Architecture has been uninstalled from your laptop and cluster.'
    say 'Thanks for your time! If you have any questions, please visit'
    say 'https://www.datawire.io for more information or'
    say 'contact us at hello@datawire.io.'
}

say() {
    echo "blackbird: $1"
}

say_info() {
    local _ansi_escapes_are_valid=$1
    local _msg=$2

    if $_ansi_escapes_are_valid; then
        printf "\e[32minfo:\e[0m $_msg\n" 1>&2
    else
        printf '%s\n' "info: $_msg" 1>&2
    fi
}

say_warn() {
    local _ansi_escapes_are_valid=$1
    local _msg=$2

    if $_ansi_escapes_are_valid; then
        printf "\e[33;1mwarn:\e[0m $_msg\n" 1>&2
    else
        printf '%s\n' "info: $_msg" 1>&2
    fi
}

say_err() {
    local _ansi_escapes_are_valid=$1
    local _msg=$2

    if $_ansi_escapes_are_valid; then
        printf "\e[31;1merror:\e[0m $_msg\n" 1>&2
    else
        printf '%s\n' "info: $_msg" 1>&2
    fi
}

ask_yn() {
    local _yn=b
    while true; do
        read -p "$1  [y|n]: " $_yn
        case $_yn in
            [Yy]* ) return 1;;
            [Nn]* ) return 0;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}

err() {
    say "$1" >&2
    exit 1
}

need_cmd() {
    if ! command -v "$1" > /dev/null 2>&1
    then err "need '$1' (command not found)"
    fi
}

need_ok() {
    if [ $? != 0 ]; then err "$1"; fi
}

assert_nz() {
    if [ -z "$1" ]; then err "assert_nz $2"; fi
}

# Run a command that should never fail. If the command fails execution
# will immediately terminate with an error showing the failing
# command.
ensure() {
    "$@"
    need_ok "command failed: $*"
}

# This is just for indicating that commands' results are being
# intentionally ignored. Usually, because it's being executed
# as part of error handling.
ignore() {
    "$@"
}

main "$@" || exit 1
