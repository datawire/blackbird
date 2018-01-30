#!/usr/bin/env bash

set -u

BLACKBIRD_REPO="https://github.com/datawire/blackbird.git"

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
    need_cmd docker
    need_cmd git
    
    chk_kubernetes_version 7 7
    
    local _install_dir=~/blackbird
        
    # --------------------------------------------------------------------------
    # Local installation
    # --------------------------------------------------------------------------    
    
    #
    # Blackbird Repo
    #
    say_info $_ansi_escapes_are_valid "Cloning Blackbird repository"
    ensure git clone --quiet $BLACKBIRD_REPO $_install_dir
    ensure cd $_install_dir
    
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
    ensure sed -i "s|__AMBASSADOR_VERSION__|$_ambassador_version|g" ambassador/service.yaml
    
    # --------------------------------------------------------------------------
    # kubernetes cluster installation
    # --------------------------------------------------------------------------

    echo ""
    say 'Please run `forge setup` and `forge deploy`'
}

# Only bothering to check the minor version of Kubernetes. All bets are off if the major
# version increases.
chk_kubernetes_version() {
    local _min_allowed_client_version=$1
    local _min_allowed_server_version=$2

    local _version_json=$(ensure kubectl version -o json)
    local _client_minor=$(ensure echo $_version_json | ensure python -c 'import json,sys; obj=json.load(sys.stdin); print(obj["clientVersion"]["minor"]);')
    local _server_minor=$(ensure echo $_version_json | ensure python -c 'import json,sys; obj=json.load(sys.stdin); print(obj["serverVersion"]["minor"]);')   
    
    if [ "$_client_minor" -lt "$_min_allowed_client_version" ]; then
        err "Your kubectl version is too outdated. You need at least 1.$_min_allowed_client_version. Please upgrade."
    fi
    
    if [ "$_server_minor" -lt "$_min_allowed_server_version" ]; then
        err "Your Kubernetes cluster version is too outdated. Need at least 1.$_min_allowed_server_version. Please upgrade."
    fi
}

say() {
    echo "blackbird: $1"
}

say_info() {
    local _ansi_escapes_are_valid=$1
    local _msg=$2

    if $_ansi_escapes_are_valid; then
        printf "\e[31minfo:\e[0m $_msg\n" 1>&2
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
