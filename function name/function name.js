function myName(args) {
	return /function\s+(\w*)\(/.exec(args.callee)[1];
}