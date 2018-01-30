#!/usr/bin/env bash

set -u

BLACKBIRD_REPO="https://github.com/datawire/blackbird.git"

usage() {
    cat 1>&2 <<EOF
blackbird-install 0.1.0
The installer for blackbird

USAGE:
    blackbird-install [FLAGS] [OPTIONS]

FLAGS:
    -h, --help              Prints help information
    -V, --version           Prints version information

EOF
}

main() {
    need_cmd curl
    need_cmd kubectl
    need_cmd docker
    need_cmd git
    
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
    
    local need_tty=yes
    for arg in "$@"; do
        case "$arg" in
            -h|--help)
                usage
                exit 0
                ;;
            -y)
                # user wants to skip the prompt -- we don't need /dev/tty
                need_tty=no
                ;;
            --cloud)
                if is_value_arg "$_arg" "prefix"; then
                    _prefix="$(get_value_arg "$_arg")"
                fi
                ;;
            *)
                ;;
        esac
    done    
    
    local _install_dir=~/blackbird
    
    # --------------------------------------------------------------------------
    # Local installation
    # --------------------------------------------------------------------------    
    
    #
    # Blackbird Repo
    #
    say_info $_ansi_escapes_are_valid "Cloning Blackbird repository"
    ensure git clone --quiet $BLACKBIRD_REPO $_install_dir
    
    #
    # Forge Install
    #
    say_info $_ansi_escapes_are_valid "Downloading Forge"    
    local _forge_version="$(curl --silent https://s3.amazonaws.com/datawire-static-files/forge/latest.url?x-download=datawire)"
    ensure curl \
        --location \
        --output /tmp/forge \
        --silent \
        https://s3.amazonaws.com/datawire-static-files/forge/$_forge_version/forge?x-download=datawire

    say_info $_ansi_escapes_are_valid "Installing Forge into /usr/local/bin (this may require root)"        
    ensure sudo -s mkdir -p /usr/local/bin
    ensure sudo -s chmod 777 /usr/local/bin
    ensure sudo -s mv /tmp/forge /usr/local/bin
    ensure chmod +x /usr/local/bin/forge
   
    say_info $_ansi_escapes_are_valid "Installing Telepresence"   
   
    say_info $_ansi_escapes_are_valid "Configuring Blackbird to use the latest Ambassador"        
    local _ambassador_version="$(curl --silent https://s3.amazonaws.com/datawire-static-files/ambassador/stable.txt)"
   
    ensure cd $_install_dir 
    # --------------------------------------------------------------------------
    # kubernetes cluster installation
    # --------------------------------------------------------------------------


    say 'Please run `forge setup` and `forge deploy`'
}

say() {
    echo "blackbird: $1"
}

say_info() {
    local _ansi_escapes_are_valid=$1
    local _msg=$2

    if $_ansi_escapes_are_valid; then
        printf "\33[1minfo:\33[0m $_msg\n" 1>&2
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
