var bump = require('gulp-bump');
var fs = require('fs');
var git = require('gulp-git');
var gulp = require('gulp');
var semver = require('semver');
var spawn = require('child_process').spawn;
var yargs = require('yargs');
var gulpSequence = require('gulp-sequence');

/**
 * Pulls the package json from fs
 */
var getPackageJson = function() {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

var newVer;


gulp.task('init', function() {
    // increment version
    var pkg = getPackageJson();
    newVer = semver.inc(pkg.version, 'patch');
});

// Override the tab size for indenting
// (or simply omit to keep the current formatting)
gulp.task('bump', function() {
    gulp.src('./package.json')
        .pipe(bump({
            version: newVer
        }))
        .pipe(gulp.dest('./'));
});

// Run git add
// src is the file(s) to add (or ./*)
gulp.task('git-add', function() {
    return gulp.src('./package.json')
        .pipe(git.add());
});

// Run git commit
// src are the files to commit (or ./*)
gulp.task('git-commit', function() {
    return gulp.src('./package.json')
        .pipe(git.commit('Publishing ' + newVer));
});

// Tag the repo with a version
gulp.task('git-tag', function() {
    git.tag('v' + newVer, 'Version message', function(err) {
        if (err) throw err;
    });
});

/**
 * Publish the changes to npm repo
 */
gulp.task('npm-publish', function(done) {
    spawn('npm', ['publish'], {
        stdio: 'inherit'
    }).on('close', done);
});

// Run git push
// remote is the remote repo
// branch is the remote branch to push to
gulp.task('git-push', function() {
    git.push('origin', 'master', function(err) {
        if (err) throw err;
    });
});

gulp.task('publish', gulpSequence('init', 'bump', 'git-add', 'git-commit', 'git-tag', 'git-push' /*,'npm-publish'*/ ));
