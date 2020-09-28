import sys
import subprocess
import hubploy.auth


if __name__ == "__main__":
    # We use kubectl to copy and exec the tests on a singleuser
    # server. This needs a kubeconfig, and so we call this,
    # use hubploy to handle auth, and call the tests in a subprocess.
    deployment = sys.argv[1]
    with hubploy.auth.cluster_auth(deployment):
        process = subprocess.Popen(["./run_tests.sh"],
                                   stdout=subprocess.PIPE,
                                   stderr=subprocess.STDOUT)
        while True:
            output = process.stdout.readline().decode()
            if output == "" and process.poll() is not None:
                break
            if output:
                print(output.strip())
        sys.exit(process.poll())
