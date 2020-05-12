#!/bin/bash
#

#SCRIPT_HOME="."
SCRIPT_NAME="api-box"
LOGS_DIR="logs"
START_OUT="start_api-box.out"
#用于更新获取路径
UPDATE_PATH=$2

function get_work_dir() {
    #SCRIPT_HOME=$(pwd)
    SCRIPT_HOME=$(dirname $0)
}

function get_os_type() {
    OS_TYPE=$(uname)
}

function logs_check() {
    get_work_dir
    if [ ! -f "${SCRIPT_HOME}/${LOGS_DIR}" ]; then
        mkdir ${SCRIPT_HOME}/${LOGS_DIR}
    fi
}

function usage() {
    echo "Usage: sh $(basename $0) [ start | stop | restart | status ]"
    echo "Usage: sh $(basename $0) [ update ] <Path for new pkg>"
    exit 1
}

function user_check() {
    USER_NAME=$(whoami)
    USER_GROUP=$(groups ${USER_NAME} | awk '{print $3}')
    #if [ "${USER_NAME}" == "root" ]; then
    if [ "${USER_GROUP}" != "root" ]; then
        PrintMsg "Please use admin user" "WARN"
        exit 1
    fi        
}

function pid_check() { 
    PID=$(ps -ef | grep -v grep | grep "\./${SCRIPT_NAME}" | awk '{print $2}')
}

function PrintMsg() {
    get_os_type
    if [ "${OS_TYPE}" == "Linux" ]; then
        if [ "$2" == "SUCCESS" ]; then
            echo -e "$1  [\033[32m $2 \033[0m]"
        elif [ "$2" == "WARN" ]; then
            echo -e "$1  [\033[33m $2 \033[0m]"
        elif [ "$2" == "FAILED" ]; then
            echo -e "$1  [\033[31m $2 \033[0m]"
        fi
    else
        if [ "$2" == "SUCCESS" ]; then
            echo "$1  [\033[32m $2 \033[0m]"
        elif [ "$2" == "WARN" ]; then
            echo "$1  [\033[33m $2 \033[0m]"
        elif [ "$2" == "FAILED" ]; then
            echo "$1  [\033[31m $2 \033[0m]"
        fi
    fi
}

function start() {
    user_check
    get_work_dir
    if [ -n "${SCRIPT_HOME}/${SCRIPT_NAME}" ]; then
        pid_check
        if [ -n "${PID}" ]; then
            echo "api-box has been started"
            exit 1
        else
            chmod a+x ${SCRIPT_HOME}/${SCRIPT_NAME}
            cd ${SCRIPT_HOME} && nohup ./${SCRIPT_NAME} >> ${START_OUT} 2>&1 &
            sleep 2
            pid_check
            if [ -n "${PID}" ]; then
                GET_PORT=$(grep -i "httpPort" conf/http.conf | grep -oE '[0-9]{1,5}')
                PrintMsg "start api-box, http://localhost:${GET_PORT}" "SUCCESS"
                    
            else
                PrintMsg "start api-box" "FAILED"
            fi
        fi
    fi
}

function stop() {
    unset PID
    user_check
    pid_check
    if [ -n "${PID}" ]; then
        kill -9 ${PID} > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            PrintMsg "shutdown api-box" "SUCCESS"
        else
            PrintMsg "shutdown api-box" "FAILED"
        fi
    
    else
        PrintMsg "api-box is not running" "WARN"
    fi
}

function status() {
    pid_check
    if [ -n "${PID}" ]; then
        GET_PORT=$(grep "httpPort" conf/http.conf | grep -oE '[0-9]{1,5}')
        echo "api-box is running, http://localhost:${GET_PORT}"
    else
        echo "api-box is not running."
    fi
}

function restart() {
    stop
    start
}

function update_bak() {
    tar -czf /tmp/api-box_$(date +%Y%m%d%H%M%S).tar.gz *
    if [ $? -eq 0 ]; then
        PrintMsg "backup api-box to /tmp/api-box_$(date +%Y%m%d%H%M%S).tar.gz" "SUCCESS"
    else
       PrintMsg "backup api-box to /tmp/api-box_$(date +%Y%m%d%H%M%S).tar.gz" "FAILED"
       return 9
    fi
}

function update_op() {
    tar -xf ${UPDATE_PATH} -C .
    if [ $? -eq 0 ]; then
        PrintMsg "Update api-box" "SUCCESS"                   
        start
        chmod a+x ${SCRIPT_NAME}
    else
        PrintMsg "Update api-box" "FAILED"
        tar -xf /tmp/api-box_$(date +%Y%m%d%H%M%S).tar.gz -C . && rm -rf /tmp/api-box_$(date +%Y%m%d%H%M%S).tar.gz
    fi
}

function update() {
    if [ -f "${UPDATE_PATH}" ]; then
        update_bak
        if [ $? -eq 0 ]; then
            pid_check
            if [ -n "${PID}" ]; then
                echo "api-box is running, stop now"
                kill -9 ${PID} > /dev/null 2>&1
            fi
            update_op
        fi
    else
        usage
    fi
}

[[ $# -gt 2 ]] && usage

user_check

case "$1" in
  start)
    start ;;
  stop)
    stop ;;
  restart)
    restart ;;
  status)
    status ;;
  update)
    update ;;
  *)
    usage ;;
esac
