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

    local _install_dir=$(pwd)/blackbird

    say_info $_ansi_escapes_are_valid "Installing the Datawire Reference Architecture"

    # --------------------------------------------------------------------------
    # Local installation
    # --------------------------------------------------------------------------

    #
    # Blackbird Repo
    #
    say_info $_ansi_escapes_are_valid "Cloning repository"
    ensure git clone --quiet $BLACKBIRD_REPO $_install_dir
    ensure cd $_install_dir

    #
    # Forge Install
    #
    say_info $_ansi_escapes_are_valid "Downloading Forge for deployment"
    local _forge_version="$(curl --silent https://s3.amazonaws.com/datawire-static-files/forge/latest.url?x-download=blackbird)"
    ensure curl \
        --location \
        --output /tmp/forge \
        --silent \
        https://s3.amazonaws.com/datawire-static-files/forge/$_forge_version/forge?x-download=blackbird

    say_info $_ansi_escapes_are_valid "Installing Forge into /usr/local/bin (this may require root)"
    ensure sudo -s mkdir -p /usr/local/bin
    ensure sudo -s chmod 777 /usr/local/bin
    ensure sudo -s mv /tmp/forge /usr/local/bin
    ensure chmod +x /usr/local/bin/forge

    say_info $_ansi_escapes_are_valid "Installing Telepresence for local development"

    # Detect if macOS, Ubuntu or Fedora
    local _platform="$(uname | tr "[:upper:]" "[:lower:]")"
    if [[ "$_platform" == "linux" ]]; then
      say_info $_ansi_escapes_are_valid "Detected Linux"
      case $(lsb_release -d) in
        *Ubuntu*)
          say_info $_ansi_escapes_are_valid "Detected Ubuntu"
          ensure curl -s https://packagecloud.io/install/repositories/datawireio/telepresence/script.deb.sh | ensure sudo -s bash
          ensure sudo apt install --no-install-recommends telepresence
          ;;
        *Fedora*)
          say_info $_ansi_escapes_are_valid "Detected Fedora"
          ensure curl -s https://packagecloud.io/install/repositories/datawireio/telepresence/script.rpm.sh | ensure sudo -s bash
          ensure sudo -s dnf install telepresence
          ;;
        *)
          err "Telepresence not supported on this OS!"
      esac
    elif [[ "$_platform" == "darwin" ]]; then
      say_info $_ansi_escapes_are_valid "Detected macOS"
      need_cmd brew
      ensure brew cask install osxfuse
      ensure brew install socat
      ensure brew install datawire/blackbird/telepresence
    else
      err "Operating System not supported. Only macOS and Linux are supported!"
    fi


    say_info $_ansi_escapes_are_valid "Configuring Blackbird to use the latest Ambassador API Gateway"
    local _ambassador_version="$(curl --silent https://s3.amazonaws.com/datawire-static-files/ambassador/stable.txt)"
    ensure sed -i"" -e "s|__AMBASSADOR_VERSION__|$_ambassador_version|g" ambassador/service.yaml

    # --------------------------------------------------------------------------
    # kubernetes cluster installation
    # --------------------------------------------------------------------------

	while true; do
		read -p "Are you using a Google Kubernetes Engine (GKE) cluster [y/n]? " _yn </dev/tty
		case $_yn in
			[Yy]* )
				need_cmd gcloud
				say_info $_ansi_escapes_are_valid "Creating RBAC cluster admin role binding"
				ensure kubectl create clusterrolebinding \
                dw-cluster-admin-binding \
                --clusterrole=cluster-admin \
                --user=$(ensure gcloud info --format="value(config.account)")
				break
				;;
			[Nn]* )
				break
				;;
			* )
				say "Please answer [y]es or [n]o."
				;;
		esac
	done

    echo ""
    say 'The Datawire Reference Architecture has been configured locally.'
    say 'You now need to deploy the demo application and its dependencies to your Kubernetes cluster.'
    say 'Please run the following commands:'
    say '    cd blackbird'
    say '    forge setup'
    say '    forge deploy'
    say 'Note that the deployment process may take a few minutes as'
    say 'it builds Java, NodeJS, and Python microservices.'
    say 'Thanks for installing the Datawire reference architecture.'
}

# Only bothering to check the minor version of Kubernetes. All bets are off if the major
# version increases.
chk_kubernetes_version() {
    local _min_allowed_client_version=$1
    local _min_allowed_server_version=$2

    local _version_json=$(ensure kubectl version --output json)
    local _client_minor=$(ensure echo $_version_json | ensure python -c 'import json,sys; obj=json.load(sys.stdin); print(obj["clientVersion"]["minor"]);' | ensure sed 's/[^0-9]*//g')
    local _server_minor=$(ensure echo $_version_json | ensure python -c 'import json,sys; obj=json.load(sys.stdin); print(obj["serverVersion"]["minor"]);' | ensure sed 's/[^0-9]*//g')

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
